// import { GestorVentas } from './gestorVentas';
// import { Administrar } from './administrar';

// document.addEventListener('DOMContentLoaded', () => {
//   const gestor = new GestorVentas();
//   new Administrar(gestor);
// });

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

import { getDoc, doc } from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, db, provider } from "./firebase";
import { GestorVentas } from "./gestorVentas";
import { Administrar } from "./administrar";

const redirectAfterAdminLoginKey = "redirectAfterAdminLogin";

async function validarAccesoAdministrador(email: string): Promise<boolean> {
  const docRef = doc(db, "usuariosAdministradores", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

const loginContainer = document.getElementById("login-container");
const contenidoApp = document.getElementById("contenido-app");
const btnLogin = document.getElementById("btnLogin") as HTMLButtonElement | null;
const loginStatus = document.getElementById("login-status");
let appIniciada = false;

function mostrarEstadoLogin(mensaje: string, enlaceVentas = false): void {
  if (!loginStatus) return;
  loginStatus.replaceChildren(document.createTextNode(mensaje));
  if (enlaceVentas) {
    const link = document.createElement("a");
    link.href = "/ventas";
    link.textContent = " Ir al registro de ventas.";
    loginStatus.append(link);
  }
}

async function login(): Promise<void> {
  if (!btnLogin) return;
  btnLogin.disabled = true;
  mostrarEstadoLogin("Abriendo el inicio de sesión de Google...");
  sessionStorage.setItem(redirectAfterAdminLoginKey, "true");

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    sessionStorage.removeItem(redirectAfterAdminLoginKey);
    console.error("Error al iniciar sesión en administración:", error);
    mostrarEstadoLogin("No se pudo iniciar sesión. Inténtalo nuevamente.");
    btnLogin.disabled = false;
  }
}

function iniciarApp(): void {
  const gestor = new GestorVentas();
  new Administrar(gestor);
}

if (!loginContainer || !contenidoApp || !btnLogin || !loginStatus) {
  throw new Error("No se encontraron los elementos necesarios para el acceso administrativo.");
}

btnLogin.addEventListener("click", () => { void login(); });

onAuthStateChanged(auth, async (user) => {
  contenidoApp.style.display = "none";
  loginContainer.style.display = "grid";
  btnLogin.disabled = false;

  if (!user) {
    sessionStorage.removeItem(redirectAfterAdminLoginKey);
    mostrarEstadoLogin("");
    return;
  }

  if (!user.email) {
    mostrarEstadoLogin("La cuenta de Google no proporcionó un correo para validar permisos.");
    return;
  }

  btnLogin.disabled = true;
  mostrarEstadoLogin("Verificando permisos de administración...");

  try {
    const autorizado = await validarAccesoAdministrador(user.email);
    if (!autorizado) {
      sessionStorage.removeItem(redirectAfterAdminLoginKey);
      mostrarEstadoLogin(
        `La cuenta ${user.email} no tiene permisos de administrador.`,
        true
      );
      btnLogin.disabled = false;
      return;
    }

    if (sessionStorage.getItem(redirectAfterAdminLoginKey) === "true") {
      sessionStorage.removeItem(redirectAfterAdminLoginKey);
      window.location.replace("/ventas");
      return;
    }

    loginContainer.style.display = "none";
    contenidoApp.style.display = "block";
    mostrarEstadoLogin("");
    if (!appIniciada) {
      iniciarApp();
      appIniciada = true;
    }
  } catch (error) {
    sessionStorage.removeItem(redirectAfterAdminLoginKey);
    console.error("Error al verificar el acceso administrativo:", error);
    mostrarEstadoLogin("No se pudieron verificar tus permisos. Inténtalo nuevamente.");
    btnLogin.disabled = false;
  }
});
