/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from 'firebase-functions/v2/https';
// import * as logger from 'firebase-functions/logger';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import functions = require('firebase-functions');
import admin = require('firebase-admin');
admin.initializeApp();

exports.resetTaskStatus = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Poland') // Example: 'America/New_York'
  .onRun(async () => {
    const db = admin.firestore();
    const tasksRef = db.collection('daily'); // Adjust 'tasks' to your actual collection name

    try {
      const snapshot = await tasksRef.where('status', '==', 'done').get();
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 'pending' });
      });
      return await batch.commit();
    } catch (error) {
      return console.log(error);
    }
  });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
