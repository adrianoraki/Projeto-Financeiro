
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQv8roDMa7_hZHtDpEjBuKHyupUslrNMw",
  authDomain: "projeto-financeiro-2026.firebaseapp.com",
  projectId: "projeto-financeiro-2026",
  storageBucket: "projeto-financeiro-2026.firebasestorage.app",
  messagingSenderId: "350718628696",
  appId: "1:350718628696:web:7da7323f212b50c0c84b2d",
  measurementId: "G-14XJBQ0409"
};

// Inicializa o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
