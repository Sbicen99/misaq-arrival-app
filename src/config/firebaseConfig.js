// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiFHwQ_va2VdlOmE7PCNQZ6m1Z-p92Pyk",
  authDomain: "misaq-arrival-app.firebaseapp.com",
  projectId: "misaq-arrival-app",
  storageBucket: "misaq-arrival-app.firebasestorage.app",
  messagingSenderId: "443610548319",
  appId: "1:443610548319:web:5c40e80e0a84e6463773ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
