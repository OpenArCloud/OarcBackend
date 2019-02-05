const functions = require('firebase-functions');

exports.onCreateUser = functions.auth.user().onCreate((user) => {    
    fb = require('./firebase-app-config.js');
    admin = fb.config.adm;
    app = fb.config.app;  

    const sanityClient = require('@sanity/client')
    const client = sanityClient({
      projectId: functions.config().sanity.projectid,
      dataset: functions.config().sanity.dataset,
      token: functions.config().sanity.token,
      useCdn: false // `false` if you want to ensure fresh data
    })    
            
    const dtIsoString = new Date().toISOString();
    return app.database().ref('users/'+user.uid).set({
        created_at: dtIsoString,
        isLoggedIn: false,
      }).then(()=>{
        console.log("user created with id: " + user.uid);
        
        //const query = '*[_type == "person"]  | order(_id, desc) {_id, firstname, lastname}';
        //return client.fetch(query);

        const doc = {
            _id: user.uid,
            _createdAt: dtIsoString,
            _type: 'person',
            email: user.email            
        };        
        return client.createOrReplace(doc);        
    }).then(persons => {        
        // persons.forEach(person => {
        //     console.log(person);
        // });            
        console.log('Document created or replaced' + persons);
        return 0;
    }).catch(err =>{
        console.log('Error: ' + err);
        return 1;
    });            

  });

  exports.onUserProfileUpdate = functions.database.ref('/users/{uid}')
    .onUpdate((change, context) => {
      // Only edit data when it is first created.
    //   if (change.before.exists()) {
    //     return null;
    //   }
      // Exit when the data is deleted.
    //   if (!change.after.exists()) {
    //     return null;
    //   }
      // Grab the current value of what was written to the Realtime Database.
      const original = change.after.val();
      console.log('Showing data for ', context.params.uid, original);      
      return 0;
    });