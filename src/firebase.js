import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, setDoc, Timestamp, updateDoc, onSnapshot, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js'


const firebaseConfig = {
  apiKey: "AIzaSyDz13stlhNnEzM5an8xlXwUPRJQtOVIu18",
  authDomain: "writemine-blog-app.firebaseapp.com",
  projectId: "writemine-blog-app",
  storageBucket: "writemine-blog-app.firebasestorage.app",
  messagingSenderId: "668312711163",
  appId: "1:668312711163:web:0eb52e0cddfa08b1c4a55e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  provider,
  signInWithPopup,
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
}