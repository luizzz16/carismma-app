// import { GestorVentas } from './gestorVentas';
// import { Ordenes } from './ordenes';
// import { initializeApp } from "firebase/app";
// import { getFirestore} from "firebase/firestore";


// // Configuración de Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyB5nu02j2CEe7wjczSB_wh5-Uf229rSL3I",
//   authDomain: "tacos-carissma.firebaseapp.com",
//   projectId: "tacos-carissma",
//   storageBucket: "tacos-carissma.firebasestorage.app",
//   messagingSenderId: "992034117238",
//   appId: "1:992034117238:web:c5b0161183be5ff9a87157",
//   measurementId: "G-GMN4606B3S"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// document.addEventListener('DOMContentLoaded', () => {
//   const gestor = new GestorVentas();
//   new Ordenes(gestor);
// });


// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// const auth = getAuth();
// const provider = new GoogleAuthProvider();

// // Validar si el correo está autorizado en Firestore
// async function validarAccesoPorCorreo(email: string): Promise<boolean> {
//   const docRef = doc(db, "usuariosAutorizados", email);
//   const docSnap = await getDoc(docRef);
//   return docSnap.exists();
// }

// // Iniciar sesión
// function login() {
//   signInWithPopup(auth, provider)
//     .then(async (result) => {
//       const email = result.user.email!;
//       const autorizado = await validarAccesoPorCorreo(email);
//       if (!autorizado) {
//         alert("Este correo no está autorizado.");
//         signOut(auth);
//       }
//     })
//     .catch(console.error);
// }

// // Escucha de sesión
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     const autorizado = await validarAccesoPorCorreo(user.email!);
//     if (autorizado) {
//       document.getElementById("contenido-app")!.style.display = "block";
//       iniciarApp();
//     } else {
//       signOut(auth);
//     }
//   } else {
//     document.getElementById("contenido-app")!.style.display = "none";
//   }
// });

// // Solo si está autorizado se carga la app
// function iniciarApp() {
//   const gestor = new GestorVentas();
//   new Ordenes(gestor);
// }

// // Botón login
// document.getElementById("btnLogin")?.addEventListener("click", login);
// document.getElementById("login-container")!.style.display = "none";
// document.getElementById("contenido-app")!.style.display = "block";

// document.getElementById("login-container")!.style.display = "flex";
// document.getElementById("contenido-app")!.style.display = "none";


// ///////////////////////////
// import { GestorVentas } from './gestorVentas';
// import { Ordenes } from './ordenes';
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// // Configuración de Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyB5nu02j2CEe7wjczSB_wh5-Uf229rSL3I",
//   authDomain: "tacos-carissma.firebaseapp.com",
//   projectId: "tacos-carissma",
//   storageBucket: "tacos-carissma.firebasestorage.app",
//   messagingSenderId: "992034117238",
//   appId: "1:992034117238:web:c5b0161183be5ff9a87157",
//   measurementId: "G-GMN4606B3S"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// const auth = getAuth();
// const provider = new GoogleAuthProvider();


// async function validarAccesoPorCorreo(email: string): Promise<boolean> {
//   const docRef = doc(db, "usuariosAutorizados", email);
//   const docSnap = await getDoc(docRef);
//   return docSnap.exists();
// }


// async function login() {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const email = result.user.email!;
//     const autorizado = await validarAccesoPorCorreo(email);

//     if (!autorizado) {
//       alert("Este correo no está autorizado.");
//       await signOut(auth);
//     }
//   } catch (error) {
//     console.error("Error en login:", error);
//   }
// }


// onAuthStateChanged(auth, async (user) => {
//   const loginContainer = document.getElementById("login-container")!;
//   const contenidoApp = document.getElementById("contenido-app")!;

//   if (user) {
//     const autorizado = await validarAccesoPorCorreo(user.email!);
//     if (autorizado) {
//       loginContainer.style.display = "none";
//       contenidoApp.style.display = "block";
//       iniciarApp();
//     } else {
//       await signOut(auth);
//     }
//   } else {
//     loginContainer.style.display = "flex";
//     contenidoApp.style.display = "none";
//   }
// });

// function iniciarApp() {
//   const gestor = new GestorVentas();
//   new Ordenes(gestor);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("btnLogin")?.addEventListener("click", login);
// });

// export {auth, provider};


import { GestorVentas } from './gestorVentas';
import { Ordenes } from './ordenes';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

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
export const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

async function validarAccesoPorCorreo(email: string): Promise<boolean> {
  const docRef = doc(db, "usuariosAutorizados", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email!;
    const autorizado = await validarAccesoPorCorreo(email);

    if (!autorizado) {
      alert("Este correo no está autorizado.");
      await signOut(auth);
    }
  } catch (error) {
    console.log("Error en login:", error);
  }
}

onAuthStateChanged(auth, async (user) => {
  const loginContainer = document.getElementById("login-container");
  const contenidoApp = document.getElementById("contenido-app");

  // Validar si los elementos existen en el DOM
  if (!loginContainer || !contenidoApp) {
    console.warn("login-container o contenido-app no existen en esta página.");
    return;
  }

  if (user) {
    const autorizado = await validarAccesoPorCorreo(user.email!);
    if (autorizado) {
      loginContainer.style.display = "none";
      contenidoApp.style.display = "block";
      iniciarApp();
    } else {
      await signOut(auth);
    }
  } else {
    loginContainer.style.display = "flex";
    contenidoApp.style.display = "none";
  }
});

function iniciarApp() {
  const gestor = new GestorVentas();
  new Ordenes(gestor);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", login);
  }
});

export { auth, provider };


