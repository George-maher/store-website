// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase config from import.meta.env (Vite) and also allow
// REACT_APP_* keys if you supply them via a build system that exposes them.
const firebaseConfig = {
  apiKey: "AIzaSyBK6Btjq5lqzoj9pEfpqtzTin1ikbwIOQY",
  authDomain: "degoy-c585f.firebaseapp.com",
  projectId: "degoy-c585f",
  storageBucket: "degoy-c585f.firebasestorage.app",
  messagingSenderId: "151319990846",
  appId: "1:151319990846:web:07018443b17ec0e72cf76f",
  measurementId: "G-PPZGD361HR"
};
// Initialize Firebase app. If env is incomplete, this still initializes but
// will fail at runtime when calling Firebase APIs.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };