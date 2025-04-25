// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNYBZiLa4pi0s769GmCzjob7DADRxuXHc",
  authDomain: "celestial-tract-452810-g3.firebaseapp.com",
  projectId: "celestial-tract-452810-g3",
  storageBucket: "celestial-tract-452810-g3.firebasestorage.app",
  messagingSenderId: "818029844896",
  appId: "1:818029844896:web:87a4530fcaa0e49651acc5",
  measurementId: "G-R39P18LYEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app); 