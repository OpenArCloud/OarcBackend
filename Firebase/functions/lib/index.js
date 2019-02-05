"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log(request.query);
    response.send("Hello from OARC Firebase!" + JSON.stringify(request));
});
//# sourceMappingURL=index.js.map