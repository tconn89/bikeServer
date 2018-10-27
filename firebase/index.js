const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

var config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
};

firebase.initializeApp(config);

// Firestore Service
//export const firestore = firebase.firestore()

// Realtime Database Service
module.exports = { db: firebase.database()}