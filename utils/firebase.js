// Import the functions you need from the SDKs you need
import { initializeApp,getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "personal-intelligence-dff55.firebaseapp.com",
  projectId: "personal-intelligence-dff55",
  storageBucket: "personal-intelligence-dff55.appspot.com",
  messagingSenderId: "913802709145",
  appId: process.env.FIREBASE_APP_ID
};


let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;