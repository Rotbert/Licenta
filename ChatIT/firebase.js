// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsVTQBhjMJKCTR_EyGh-BfLOEobSqyqAU",
  authDomain: "chatit-61609.firebaseapp.com",
  projectId: "chatit-61609",
  storageBucket: "chatit-61609.appspot.com",
  messagingSenderId: "774458906207",
  appId: "1:774458906207:web:6e3d82b8e6886bf2c4adea",
  measurementId: "G-H425XBVPKF",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();

export { auth };
export default db;
