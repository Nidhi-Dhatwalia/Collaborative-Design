// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNYBZiLa4pi0s769GmCzjob7DADRxuXHc",
  authDomain: "celestial-tract-452810-g3.firebaseapp.com",
  projectId: "celestial-tract-452810-g3",
  storageBucket: "celestial-tract-452810-g3.firebasestorage.app",
  messagingSenderId: "818029844896",
  appId: "1:818029844896:web:87a4530fcaa0e49651acc5",
  measurementId: "G-R39P18LYEH"
};

 
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); 
export { app, db , auth };
