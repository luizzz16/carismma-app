// // loginHandler.ts
// import { getDoc, doc } from "firebase/firestore";
// import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
// import { auth, db, provider } from "./app";


// export async function validarAccesoPorCorreo(email: string): Promise<boolean> {
//   const docRef = doc(db, "usuariosAutorizados", email);
//   const docSnap = await getDoc(docRef);

//   if (!docSnap.exists()) return false;

//   const data = docSnap.data();
//   return data.rol === "administrador";
// }

// export async function login() {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const email = result.user.email!;
//     const autorizado = await validarAccesoPorCorreo(email);

//     if (!autorizado) {
//       alert(`Este correo (${email}) no está autorizado.`);
//       console.error("Acceso denegado para:", email);
//       await signOut(auth);
//     }
//   } catch (error) {
//     console.error("Error en login:", error);
//   }
// }

// export function setupAuthListener(onAuthorized: () => void) {
//   onAuthStateChanged(auth, async (user) => {
//     const loginContainer = document.getElementById("login-container");
//     const contenidoApp = document.getElementById("contenido-app");

//     if (!loginContainer || !contenidoApp) {
//       console.warn("login-container o contenido-app no existen en esta página.");
//       return;
//     }

//     if (user) {
//       const autorizado = await validarAccesoPorCorreo(user.email!);
//       if (autorizado) {
//         loginContainer.style.display = "none";
//         contenidoApp.style.display = "block";
//         onAuthorized();
//       } else {
//         await signOut(auth);
//       }
//     } else {
//       loginContainer.style.display = "flex";
//       contenidoApp.style.display = "none";
//     }
//   });
// }

// export function setupLoginButton() {
//   const btnLogin = document.getElementById("btnLogin");
//   if (btnLogin) {
//     btnLogin.addEventListener("click", login);
//   }
// }
