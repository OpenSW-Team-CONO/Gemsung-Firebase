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
        const data = {
          videoKey: context.params.profileKey,
          src: original.src
        }
        console.log("ready for process data:", data);

        let options = {
          uri: "http://3.115.252.11/generate",
          method: "POST",
          body: data,
          json: true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
        };

        const request = require("request");

        // request.post(options, function(err, httpResponse, body) {
        //   if (err) {
        //     console.error("request err", err);
        //   }
        //   console.log("body", body);
        // });
        request.post(options, (error, res, body) => {
          if (error) {
            console.error("request", error);
            return;
          }
          console.log(`statusCode: ${res.statusCode}`);
          console.log(body);
        });
        break;
      default:
        break;
    }
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return change.after.ref.set(original);
  });
