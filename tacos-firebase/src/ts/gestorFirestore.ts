// gestorOrdenesFirestore.ts
import {collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDoc, query, orderBy, where, getDocs} from "firebase/firestore";
import {db} from "./app";
import {Orden} from "./orden";
import {SubOrden} from "./subOrden";

export class GestorOrdenesFirestore {
  private static readonly coleccion = "ordenes";

  ////////////////////////////////////////////////////////////////////
  //  Guardar nueva orden
  static async guardarOrden(orden: Orden) {
    const ordenObj = orden.toJSON ? orden.toJSON() : JSON.parse(JSON.stringify(orden));
    // ordenObj.fecha = orden.fecha;
    ordenObj.fecha = orden.fecha;
    ordenObj.fecha = orden.fecha.toISOString().split("T")[0]; // "2025-07-18"
    const docRef = await addDoc(collection(db, this.coleccion), ordenObj);

    orden.id = docRef.id; // Asignar el ID de Firestore a la orden
    await updateDoc(docRef, { id: docRef.id });
    console.log("Orden con noMesa guardada en Firestore con ID:", orden.id);
  }

  ////////////////////////////////////////////////////////////////////
  // Escuchar todas las órdenes en tiempo real
  static escucharOrdenes(callback: (ordenes: Orden[]) => void) {
    const ref = collection(db, this.coleccion);
    const ordenesQuery = query(ref, 
      orderBy("fecha"),
      where("_estadoOrden", "==", false)); // Solo órdenes no pagadas

    onSnapshot(ordenesQuery, (snapshot) => {
      const ordenes = snapshot.docs.map(doc => Orden.fromJSON({ id: doc.id, ...doc.data() }));
      callback(ordenes);
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Actualizar subórdenes de una orden
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

  ////////////////////////////////////////////////////////////////////
  // Obtener una orden por ID
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

  ////////////////////////////////////////////////////////////////////
  // Actualizar especificaciones de una orden
  static async actualizarEspecificaciones(idOrden: string, nuevasEspecificaciones: string) {
    try {
      const ordenRef = doc(db, this.coleccion, idOrden);
      await updateDoc(ordenRef, {
        _especificaciones: nuevasEspecificaciones
      });
      console.log("Especificaciones actualizadas correctamente");
    } catch (error) {
      console.error("Error al actualizar especificaciones:", error);
    }
  }

  ////////////////////////////////////////////////////////////////////
  // Eliminar una orden
  static async eliminarOrden(id: string) {
    await deleteDoc(doc(db, this.coleccion, id));
  }

  ////////////////////////////////////////////////////////////////////
  // Eliminar una suborden de una orden
  static async eliminarSubOrden(idOrden: string, idSubOrden: string) {
    try {
      const ordenRef = doc(db, this.coleccion, idOrden);
      const ordenSnap = await getDoc(ordenRef);

      if (!ordenSnap.exists()) {
        console.error("Orden no encontrada");
        return;
      }
      const ordenData = ordenSnap.data();
      const subOrdenesJson = ordenData._subOrdenes || [];
      // Convertir todos a SubOrden para asegurar métodos
      const subOrdenes = subOrdenesJson.map((sub: any) => SubOrden.fromJSON(sub));
      // Filtrar la suborden a eliminar por idSub
      const subOrdenActualizada = subOrdenes.filter((sub: any) => sub.idSub !== idSubOrden);
      // Asegurar que todos sean instancias de SubOrden antes de toJSON
      const subOrdenActualizadaInstancias = subOrdenActualizada.map((sub: any) =>
        sub instanceof SubOrden ? sub : SubOrden.fromJSON(sub)
      );
      await updateDoc(ordenRef, {
        _subOrdenes: subOrdenActualizadaInstancias.map((sub: any) => sub.toJSON())
      });
      console.log("Suborden eliminada correctamente");
    } catch (e) {
      console.error("Error al eliminar suborden:", e);
    }
  }

  ////////////////////////////////////////////////////////////////////
  // Cambiar estado de una orden a pagada
  static async cambiarEstadoOrden(idOrden: string) {
  try {
    const ordenRef = doc(db, this.coleccion, idOrden);

    await updateDoc(ordenRef, {
      _estadoOrden: true
    });

    console.log(`Orden ${idOrden} marcada como pagada`);
  } catch (e) {
    console.error("Error al cambiar el estado de la orden:", e);
  }
}

  ////////////////////////////////////////////////////////////////////
  // Obtener órdenes por fecha
  static async obtenerOrdenesPorFecha(fechaBuscada: string): Promise<Orden[]> {
    const ref = collection(db, this.coleccion);

    // Consulta compuesta: estado true + fecha exacta
    const q = query(
      ref,
      where("_estadoOrden", "==", true),
      where("fecha", "==", fechaBuscada)
    );

    const snapshot = await getDocs(q);
    const ordenes: Orden[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      console.log("Fecha en Firestore:", data.fecha);  // Confirmar que coincide
      ordenes.push(Orden.fromJSON({ id: docSnap.id, ...data }));
    });

    return ordenes;
  }

}
