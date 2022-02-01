// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDPAhhXUeoqJbnRsr_1MHu_MXHG-3aeMM",
  authDomain: "clone-5cb3a.firebaseapp.com",
  projectId: "clone-5cb3a",
  storageBucket: "clone-5cb3a.appspot.com",
  messagingSenderId: "288307886261",
  appId: "1:288307886261:web:2a22fc14960520f6e266fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();