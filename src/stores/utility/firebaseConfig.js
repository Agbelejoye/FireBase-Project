// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTyc5Q9tWxwZGdxzFI5buybh4kZaJ_UTk",
  authDomain: "graniteproject-d63af.firebaseapp.com",
  projectId: "graniteproject-d63af",
  storageBucket: "graniteproject-d63af.firebasestorage.app",
  messagingSenderId: "811403856371",
  appId: "1:811403856371:web:07d622d5097167840caa86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app as firebaseApp, db }