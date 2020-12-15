import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

console.log('this is apiKey', process.env.API_KEY);
console.log('this is storageBucket', process.env.STORAGE_BUCKET);

// get configuration from Project Settings for app in Firebase Console
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// initialize connection to Firebase
firebase.initializeApp(firebaseConfig);

// initialize Firebase Firestore
const db = firebase.firestore();

// initialize Firebase Storage
const storage = firebase.storage();

export { db, storage, firebase as default }