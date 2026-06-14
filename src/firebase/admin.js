import admin from "firebase-admin";

const isConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

let db = null;
let storage = null;
let isMock = true;

if (isConfigured) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
    }
    db = admin.firestore();
    storage = admin.storage();
    isMock = false;
    console.log("EverCare Backend: Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("EverCare Backend: Firebase Admin init failed, using mock data.", error.message);
    isMock = true;
  }
} else {
  console.log("EverCare Backend: No Firebase config found. Running in mock mode.");
}

export { db, storage, isMock };
