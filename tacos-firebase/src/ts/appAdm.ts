import { GestorVentas } from './gestorVentas';
import { Administrar } from './administrar';

document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorVentas();
  new Administrar(gestor);
});

// import { getDoc, doc } from "firebase/firestore";
// import { db } from "./app"; // Asegúrate de tener esto configurado

// async function validarAcceso(correo: string, seccion: "orden" | "administrar") {
//   const docRef = doc(db, "usuariosAutorizados", correo);
//   const docSnap = await getDoc(docRef);

//   if (!docSnap.exists()) {
//     alert("Usuario no autorizado.");
//     return false;
//   }

//   const rol = docSnap.data().rol;
  
//   if (seccion === "orden" && rol === "empleado") return true;
//   if (seccion === "administrar" && rol === "administrador") return true;

//   alert("Acceso denegado para esta sección.");
//   return false;
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const btnAdminLogin = document.getElementById('btnAdminLogin') as HTMLButtonElement;
//   const inputCorreo = document.getElementById('correoInput') as HTMLInputElement;

//   const adminLoginContainer = document.getElementById('admin-login-container')!;
//   const adminApp = document.getElementById('admin-app')!;

//   btnAdminLogin.addEventListener('click', async () => {
//     const correo = inputCorreo.value.trim().toLowerCase();

//     const acceso = await validarAcceso(correo, "administrar"); // puedes cambiar a "orden"
//     if (!acceso) return;

//     adminLoginContainer.style.display = 'none';
//     adminApp.style.display = 'block';

//     const gestor = new GestorVentas();
//     new Administrar(gestor);
//   });
// });

// import { getDoc, doc } from "firebase/firestore";
// import { db } from "./app";
// import { GestorVentas } from './gestorVentas';
// import { Administrar } from './administrar';

// async function validarAcceso(correo: string, seccion: "orden" | "administrar") {
//   const docRef = doc(db, "usuariosAutorizados", correo);
//   const docSnap = await getDoc(docRef);

//   if (!docSnap.exists()) {
//     alert("Usuario no autorizado.");
//     return false;
//   }

//   const rol = docSnap.data().rol;
  
//   if (seccion === "orden" && rol === "empleado") return true;
//   if (seccion === "administrar" && rol === "administrador") return true;

//   alert("Acceso denegado para esta sección.");
//   return false;
// }


// document.addEventListener("DOMContentLoaded", () => {
//   const btnAdminLogin = document.getElementById('btnAdminLogin') as HTMLButtonElement | null;
//   const inputCorreo = document.getElementById('correoInput') as HTMLInputElement | null;
//   const adminLoginContainer = document.getElementById('admin-login-container');
//   const adminApp = document.getElementById('admin-app');

//   if (!btnAdminLogin || !inputCorreo || !adminLoginContainer || !adminApp) {
//     console.error("Elementos del DOM no encontrados. Verifica tu HTML.");
//     return;
//   }

//   btnAdminLogin.addEventListener('click', async () => {
//     const correo = inputCorreo.value.trim().toLowerCase();
//     const acceso = await validarAcceso(correo, "administrar");
//     if (!acceso) return;

//     adminLoginContainer.style.display = 'none';
//     adminApp.style.display = 'block';

//     const gestor = new GestorVentas();
//     new Administrar(gestor);
//   });
// });

// import { getDoc, doc } from "firebase/firestore";
// import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
// import { auth, db, provider } from "./app";
// import { GestorVentas } from "./gestorVentas";
// import { Administrar } from "./administrar";

// async function validarAccesoAdministrador(email: string): Promise<boolean> {
//   const docRef = doc(db, "usuariosAdministradores", email);
//   const docSnap = await getDoc(docRef);
//   return docSnap.exists(); // Solo importa que exista
// }

// // Iniciar sesión con Google
// async function login() {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const email = result.user.email!;
//     const autorizado = await validarAccesoAdministrador(email);

//     if (!autorizado) {
//       alert("Este correo no tiene acceso como administrador.");
//       await signOut(auth);
//       return;
//     }
//   } catch (error) {
//     console.log("Error en login:", error);
//   }
// }

// onAuthStateChanged(auth, async (user) => {
//   const loginContainer = document.getElementById("login-container")!;
//   const contenidoApp = document.getElementById("contenido-app")!;

//   if (user) {
//     const autorizado = await validarAccesoAdministrador(user.email!);
//     if (autorizado) {
//       loginContainer.style.display = "none";
//       contenidoApp.style.display = "block";
//       iniciarApp();
//     } else {
//       alert("No tienes permisos de administrador.");
//       await signOut(auth);

//       // Aquí ocultamos todo y salimos para no ejecutar nada más
//       loginContainer.style.display = "flex";
//       contenidoApp.style.display = "none";
//       return;  // Detenemos ejecución
//     }
//   } else {
//     loginContainer.style.display = "flex";
//     contenidoApp.style.display = "none";
//   }
// });


// // Inicializa la lógica del panel de administrador
// function iniciarApp() {
//   const gestor = new GestorVentas();
//   new Administrar(gestor);
// }

// // Evento del botón
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("btnLogin")?.addEventListener("click", login);
// });







