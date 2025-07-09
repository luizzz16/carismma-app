// gestorOrdenesFirestore.ts
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./app"; // Asegúrate de que la ruta sea correcta
import { Orden } from "./orden";
import { SubOrden } from "./subOrden"; // Asegúrate de que la ruta sea correcta

export class GestorOrdenesFirestore {
  private static readonly coleccion = "ordenes";
  
  static async guardarEnFirestore(orden: Orden) {
    try {
      const ordenObj = orden.toJSON ? orden.toJSON() : JSON.parse(JSON.stringify(orden));
      await addDoc(collection(db, "ordenes"), ordenObj);
      console.log("Orden guardada en Firestore");
    } catch (e) {
      console.error("Error al guardar en Firestore:", e);
    }
  }

  // Guardar nueva orden
  static async guardarOrden(orden: Orden) {
    const ordenObj = orden.toJSON ? orden.toJSON() : JSON.parse(JSON.stringify(orden));
    const docRef = await addDoc(collection(db, this.coleccion), ordenObj);

    orden.id = docRef.id; // Asignar el ID de Firestore a la orden
    await updateDoc(docRef, { id: docRef.id });
    console.log("Orden con noMesa guardada en Firestore con ID:", orden.id);
  }

  // Escuchar todas las órdenes en tiempo real
  static escucharOrdenes(callback: (ordenes: Orden[]) => void) {
    const ref = collection(db, this.coleccion);
    onSnapshot(ref, (snapshot) => {
      const ordenes = snapshot.docs.map(doc => Orden.fromJSON({ id: doc.id, ...doc.data() }));
      callback(ordenes);
    });
  }

  static async actualizarSubOrdenes(idOrden: string, subOrdenes: SubOrden[]) {
    try {
      const ordenRef = doc(db, this.coleccion, idOrden);
      await updateDoc(ordenRef, {
        _subOrdenes: subOrdenes.map(sub => sub.toJSON())
      });
      console.log("Subórdenes actualizadas en Firestore");
    } catch (e) {
      console.error("Error al actualizar subórdenes:", e);
    }
  }

  static async obtenerOrdenPorId(idOrden: string): Promise<Orden | null> {
    try {
      const ref = doc(db, 'ordenes', idOrden);
      const docSnap = await getDoc(ref);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();

      const orden = Orden.fromJSON({ id: docSnap.id, ...data });

      return orden;
    } catch (error) {
      console.error("Error al obtener orden:", error);
      return null;
    }
  }


  // // Actualizar estado de una orden
  // static async marcarPagada(id: string) {
  //   await updateDoc(doc(db, this.coleccion, id), { pagado: true });
  // }

  // // Eliminar una orden
  // static async eliminarOrden(id: string) {
  //   await deleteDoc(doc(db, this.coleccion, id));
  // }
}
