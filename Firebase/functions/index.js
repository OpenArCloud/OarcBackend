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