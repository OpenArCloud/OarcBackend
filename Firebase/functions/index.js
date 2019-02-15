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
        isLoggedIn: false
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

  exports.onUserProfileUpdate = functions.database.ref('/members/{uid}/personal_details')
    .onCreate((snapshot, context) => {

      //Exit when the data is deleted.    
      // if (!change.after.exists()) {
      //   return null;
      // }

      const path = require('path');
      const os = require('os');
      const fs = require('fs');
      
      //Grab the current value of what was written to the Realtime Database.
      const pdetails = snapshot.val();
      //const pdetails = member_obj.personal_details;

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
        membertype : pdetails.membertype,
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
  .onWrite((change, context) => {    

    if (!change.after.exists()) {
      return null;
    }

    const sanityClient = require('@sanity/client');
    const client = sanityClient({
      projectId: functions.config().sanity.projectid,
      dataset: functions.config().sanity.dataset,
      token: functions.config().sanity.token,
      useCdn: false // `false` if you want to ensure fresh data
    });      

    var stripe = require("stripe")(functions.config().stripe.key_live);    
    const payment_info = change.after.val();
    console.log('token', payment_info.token.id);
    //console.log('email', admin.auth().getUser(context.params.uid));
    var userRecord;
    const uid = context.params.uid;
    return admin.auth().getUser(uid)
    .then (userRec => {
      userRecord = userRec.toJSON();
      console.log('user record', userRecord);
      console.log('user email', userRecord.email);
      var ref = app.database().ref('/members/'+uid+'/personal_details');
      return ref.once('value');
    }).then(snapshot => ((snapshot.val() && snapshot.val().membertype) || 'Anonymous')        
    ).then( membertype => {
      console.log('Member Type', membertype);
      return new Promise((resolve, reject) => {        
        var chargeAmount = (membertype === 'studentparttimeother')?60:120;
        chargeAmount = chargeAmount * 100;
        stripe.charges.create({
          amount: chargeAmount,
          currency: functions.config().stripe.currency,
          source: payment_info.token.id,
          receipt_email: userRecord.email,
        }, (err, charge) => {
          if(charge) {
            console.log('Charge created: ', charge);
            const chargedAmount = charge.amount/100;
            const dtIsoString = new Date().toISOString();
            app.database().ref('members/'+uid+'/payment_resp/'+payment_info.token.id).set({
              ok: true,
              amount: chargedAmount,
              date_paid: dtIsoString,
            }, () => {
              resolve(dtIsoString);
            });                        
          } else {
            console.log('Error: ', err);
            app.database().ref('members/'+uid+'/payment_resp/'+payment_info.token.id).set({
              ok: false,            
              msg: err.code || 'Stripe Exception',
            }, () => {
              reject(err);    
            });                                                
          }
        });      
      });
    }).then ( dateCreated => {
      if(dateCreated) {
        return client.patch(context.params.uid).set({
          hasPaid : true,
          membershipstartdate: dateCreated,
          lastpaymentdate : dateCreated
        }).commit();        
      } else {
        return null;
      }
    }).then( document => 
      console.log('Sanity document updated with payment info', document)
    ).catch(err=>{
      console.log('Error catch: ', err);
      return err;
    });
});
