import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAxlA_srhxfRTSSarMqk6AdFpuqB_zRWHw",
    authDomain: "notion-clone-2faba.firebaseapp.com",
    projectId: "notion-clone-2faba",
    storageBucket: "notion-clone-2faba.firebasestorage.app",
    messagingSenderId: "53430763665",
    appId: "1:53430763665:web:ceb2f9d45ef761c85a3f30"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);

  export{ db };