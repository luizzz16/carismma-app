import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5nu02j2CEe7wjczSB_wh5-Uf229rSL3I",
  authDomain: "tacos-carissma.firebaseapp.com",
  projectId: "tacos-carissma",
  storageBucket: "tacos-carissma.firebasestorage.app",
  messagingSenderId: "992034117238",
  appId: "1:992034117238:web:c5b0161183be5ff9a87157",
  measurementId: "G-GMN4606B3S"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();
