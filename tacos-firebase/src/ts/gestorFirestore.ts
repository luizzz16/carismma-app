// gestorOrdenesFirestore.ts
import {collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, query, orderBy, where, getDocs} from "firebase/firestore";
import {db} from "./app"; // Asegúrate de que la ruta sea correcta
import {Orden} from "./orden";
import {SubOrden} from "./subOrden"; // Asegúrate de que la ruta sea correcta

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
    ordenObj.fecha = serverTimestamp();
    const docRef = await addDoc(collection(db, this.coleccion), ordenObj);

    orden.id = docRef.id; // Asignar el ID de Firestore a la orden
    await updateDoc(docRef, { id: docRef.id });
    console.log("Orden con noMesa guardada en Firestore con ID:", orden.id);
  }

  // Escuchar todas las órdenes en tiempo real
  static escucharOrdenes(callback: (ordenes: Orden[]) => void) {
    const ref = collection(db, this.coleccion);
    const ordenesQuery = query(ref, orderBy("fecha"));

    onSnapshot(ordenesQuery, (snapshot) => {
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


  // Eliminar una orden
  static async eliminarOrden(id: string) {
    await deleteDoc(doc(db, this.coleccion, id));
  }

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

    // try {
    //   const ordenRef = doc(db, this.coleccion, idOrden);
    //   await updateDoc(ordenRef, {
    //     _especificaciones: nuevasEspecificaciones
    //   });

  static async cambiarEstadoOrden(idOrden: string) {
  try {
    const ordenRef = doc(db, this.coleccion, idOrden);

    await updateDoc(ordenRef, {
      _estadoOrden: true // <-- así se marca como pagada
    });

    console.log(`Orden ${idOrden} marcada como pagada`);
  } catch (e) {
    console.error("Error al cambiar el estado de la orden:", e);
  }
}


  static async obtenerOrdenesPorFecha(fecha: Date): Promise<Orden[]> {
    const fechaFormateada = Orden.formatDate(fecha); // yyyy-mm-dd

    const ref = collection(db, this.coleccion);
    const ordenesQuery = query(
      ref,
      where("_estadoOrden", "==", true), // 🔍 solo órdenes pagadas
      orderBy("fecha") // opcional: ordenarlas por fecha
    );

    const snapshot = await getDocs(ordenesQuery);
    const ordenes: Orden[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const fechaOrden = data._fecha?.toDate?.() || new Date(data._fecha);

      // Formateamos la fecha para comparar solo yyyy-mm-dd
      const fechaSolo = fechaOrden.toISOString().split("T")[0];

      if (fechaSolo === fechaFormateada) {
        ordenes.push(Orden.fromJSON({ id: docSnap.id, ...data }));
      }
    });

    return ordenes;
  }



}
