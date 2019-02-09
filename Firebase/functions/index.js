const functions = require('firebase-functions');
const fb = require('./firebase-app-config.js');
admin = fb.config.adm;
app = fb.config.app;  

exports.onCreateUser = functions.auth.user().onCreate((user) => {    
    const sanityClient = require('@sanity/client');
    const client = sanityClient({
      projectId: functions.config().sanity.projectid,
      dataset: functions.config().sanity.dataset,
      token: functions.config().sanity.token,
      useCdn: false // `false` if you want to ensure fresh data
    });    
            
    const dtIsoString = new Date().toISOString();
    return app.database().ref('members/'+user.uid).set({
        created_at: dtIsoString,
        isLoggedIn: false,
        personal_details : {
          email : user.email
        }      
      }).then(()=>{
        console.log("user created with id: " + user.uid);
        
        //const query = '*[_type == "person"]  | order(_id, desc) {_id, firstname, lastname}';
        //return client.fetch(query);

        const doc = {
            _id: user.uid,
            _createdAt: dtIsoString,
            _type: 'member',
            personaldetails: {
              _type: 'person',
              email: user.email,            
            }            
        };        
        return client.createOrReplace(doc);        
    }).then(res => {        
        // persons.forEach(person => {
        //     console.log(person);
        // });            
        console.log(`Member was created, document ID is ${res._id}`)
        return 0;
    }).catch(err =>{
        console.log('Error: ' + err);
        return 1;
    });            

  });

  exports.onUserProfileUpdate = functions.database.ref('/members/{uid}')
    .onUpdate((change, context) => {

      //Exit when the data is deleted.    
      if (!change.after.exists()) {
        return null;
      }

      const path = require('path');
      const os = require('os');
      const fs = require('fs');
      
      //Grab the current value of what was written to the Realtime Database.
      const member_obj = change.after.val();
      const pdetails = member_obj.personal_details;

      const sanityClient = require('@sanity/client');
      const client = sanityClient({
        projectId: functions.config().sanity.projectid,
        dataset: functions.config().sanity.dataset,
        token: functions.config().sanity.token,
        useCdn: false // `false` if you want to ensure fresh data
      });      
      
      // const bucket = admin.storage().bucket('openarcloud.appspot.com');
      // const filePath = pdetails.image_ref;
      // const fileName = path.basename(filePath);
      // const tempFilePath = path.join(os.tmpdir(), fileName);

      const doc = {
        city            : pdetails.city,
        country         : pdetails.country,
        email           : pdetails.email,
        firstname       : pdetails.firstname,          
        jobtitleorrole  : pdetails.jobtitleorrole,
        lastname        : pdetails.lastname,
        organizations   : pdetails.organizations,
        postcodeorzip   : pdetails.postcodeorzip,
        streetaddress   : pdetails.streetaddress,
        yearofbirth     : pdetails.yearofbirth
      };      

      return client.patch(context.params.uid).set({
        membertype : member_obj.membertype,
        personaldetails : doc
      }).commit().then(new_dcoument => 
      console.log('member is updated in sanity ', new_dcoument)            
    ).catch(error => {
        console.error('Upload failed:', error.message)
    });

      // return bucket.file(filePath).download({
      //   destination: tempFilePath,
      // }).then(() => 
      //   console.log('Image downloaded locally to', tempFilePath)        
      // ).then(()=> 
      //   client.assets.upload('image', fs.createReadStream(tempFilePath), {filename: fileName})
      // ).then(document => {
      //   console.log('The image was uploaded!', document);
      //   const doc = {
      //     city            : pdetails.city,
      //     country         : pdetails.country,
      //     email           : pdetails.email,
      //     firstname       : pdetails.firstname,          
      //     jobtitleorrole  : pdetails.jobtitleorrole,
      //     lastname        : pdetails.lastname,
      //     organizations   : pdetails.organizations,
      //     portrait        : {
      //       _type: 'image',
      //       asset: {
      //         _ref:document._id,
      //         _type: 'reference'
      //       }
      //     },  
      //     postcodeorzip   : pdetails.postcodeorzip,
      //     streetaddress   : pdetails.streetaddress,
      //     yearofbirth     : pdetails.yearofbirth
      //   };      

      //   return client.patch(context.params.uid).set({
      //     membertype : member_obj.membertype,
      //     personaldetails : doc
      //   }).commit();
      // }).then(new_dcoument => 
      //   console.log('member is updated in sanity ', new_dcoument)            
      // ).catch(error => {
      //     console.error('Upload failed:', error.message)
      // });

  });

  // exports.createStripeCharge = functions.https.onRequest((req, res) => {
  //   console.log(req.body);        
  //   var stripe = require("stripe")("sk_test_b1TvqWzZV8A191qCQgP90cUx");    

  //   (async () => {
  //     const charge = await stripe.charges.create({
  //       amount: 999,
  //       currency: 'usd',
  //       source: 'tok_visa',
  //       receipt_email: 'nouman.hanif@hotmail.com',
  //     });

  //     console.log('Charge created: ', charge);
  //     res.status(200).send({ok: true, msg: charge});
  //   })().catch(err => {
  //     console.log('Error: ', err);
  //     res.status(400).send({ok: false, msg: err});
  //   });        
  // });


  exports.createStripeCharge = functions.database.ref('/members/{uid}/payment_info')
  .onUpdate((change, context) => {    

    var stripe = require("stripe")(functions.config().stripe.key);    
    const payment_info = change.after.val();
    
    (async () => {
      const charge = await stripe.charges.create({
        amount: 999,
        currency: functions.config().stripe.currency,
        source: 'tok_visa',
        receipt_email: context.params.email,
      });

      if(charge) {
        console.log('Charge created: ', charge);
        return {ok: true, msg: charge};  
      }
      return {ok: false, msg: 'unknown error'};  
    })().catch(err => {
      console.log('Error: ', err);
      return {ok: false, msg: err};
    });        
  });

  // endpoint for email subscription
  exports.subscribeToEmailUpdates = functions.https.onRequest((req, res) => {
     console.log(req.params);  
     console.log(functions.config());
     const sanityClient = require('@sanity/client');
     const client = sanityClient({
       projectId: functions.config().sanity.projectid,
       dataset: functions.config().sanity.dataset,
       token: functions.config().sanity.token,
       useCdn: false // `false` if you want to ensure fresh data
     });    
     const dtIsoString = new Date().toISOString();
     const doc = {

            _createdAt: dtIsoString,
            _type: 'emailsubscriber',
            
              email: req.params.email,
              utctimestamp: req.params.timestamp             
                      
      };       
      return client.createOrReplace(doc);  
       
   });