// import { GestorVentas } from './gestorVentas.js';
// import { Ordenes } from './ordenes.js';

// document.addEventListener('DOMContentLoaded', () => {
//   const gestor = new GestorVentas();
//   new Ordenes(gestor);
// });

// // Import the functions you need from the SDKs you need
// import { GestorVentas } from './gestorVentas';
// import { Ordenes } from './ordenes';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// document.addEventListener('DOMContentLoaded', () => {
//     const gestor = new GestorVentas();
//     new Ordenes(gestor);
// });
// // Import the functions you need from the SDKs you need

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB5nu02j2CEe7wjczSB_wh5-Uf229rSL3I",
//   authDomain: "tacos-carissma.firebaseapp.com",
//   projectId: "tacos-carissma",
//   storageBucket: "tacos-carissma.firebasestorage.app",
//   messagingSenderId: "992034117238",
//   appId: "1:992034117238:web:c5b0161183be5ff9a87157",
//   measurementId: "G-GMN4606B3S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import { GestorVentas } from './gestorVentas';
import { Ordenes } from './ordenes';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB5nu02j2CEe7wjczSB_wh5-Uf229rSL3I",
  authDomain: "tacos-carissma.firebaseapp.com",
  projectId: "tacos-carissma",
  storageBucket: "tacos-carissma.firebasestorage.app",
  messagingSenderId: "992034117238",
  appId: "1:992034117238:web:c5b0161183be5ff9a87157",
  measurementId: "G-GMN4606B3S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorVentas();
  new Ordenes(gestor);

  // Aquí puedes añadir: escucharOrdenesEnTiempoReal(gestor);
});



