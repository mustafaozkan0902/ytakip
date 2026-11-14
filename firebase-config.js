import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBE1mQfMolZtjz9AW_FbyZlhxD_7MmM3bk",
  authDomain: "borctakip-66e58.firebaseapp.com",
  projectId: "borctakip-66e58",
  storageBucket: "borctakip-66e58.firebasestorage.app",
  messagingSenderId: "179591837738",
  appId: "1:179591837738:web:cf7c971bad13f878d3eb53",
  measurementId: "G-M85LB2KTQD"
};

let app = null;
let db = null;
let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseInitialized = true;
} catch (error) {
  console.error("Firebase bağlantı hatası:", error);
}

export { app, db, isFirebaseInitialized, doc, setDoc, onSnapshot };
