
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importar o Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQv8roDMa7_hZHtDpEjBuKHyupUslrNMw",
  authDomain: "projeto-financeiro-2026.firebaseapp.com",
  projectId: "projeto-financeiro-2026",
  storageBucket: "projeto-financeiro-2026.appspot.com",
  messagingSenderId: "350718628696",
  appId: "1:350718628696:web:7da7323f212b50c0c84b2d",
  measurementId: "G-14XJBQ0409"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // Inicializar o Storage

export { auth, provider, db, storage }; // Exportar o storage
