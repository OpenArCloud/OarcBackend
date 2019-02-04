// Config file
const admin = require('firebase-admin');
const appObj = !admin.apps.length ? admin.initializeApp() : admin.app();
module.exports.config = { 
    app : appObj,
    adm : admin
};

