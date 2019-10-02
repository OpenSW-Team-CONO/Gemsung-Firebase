const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.triggerProfileReady = functions.database
  .ref("/{profileKey}")
  .onUpdate((change, context) => {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null;
    }
    // Grab the current value of what was written to the Realtime Database.
    const original = change.after.val();
    console.log(
      "Profile key: ",
      context.params.profileKey,
      " data: ",
      original
    );

    switch (original.flag) {
      case 1:
        console.log("ready for process");
        break;
      default:
        break;
    }
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return change.after.ref.set(original);
  });
