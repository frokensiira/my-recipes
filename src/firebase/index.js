import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

// get configuration from Project Settings for app in Firebase Console
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// initialize connection to Firebase
firebase.initializeApp(firebaseConfig);

// initialize Firebase Auth
const auth = firebase.auth();

// initialize Firebase Firestore
const db = firebase.firestore();

// initialize Firebase Storage
const storage = firebase.storage();

export { auth, db, storage, firebase as default };
