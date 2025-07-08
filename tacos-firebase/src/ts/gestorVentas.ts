import {serializarOrden} from "./serializar";
import {Orden} from "./orden";
import { deserializarOrden} from "./serializar";
import {collection, addDoc} from "firebase/firestore";
import {db} from "./app.js";

export class GestorVentas {
  private _ventasPorDia: Record<string, Orden[]> = {};
  // private _ventasPorSemana: Record<string, Orden[]> = {};

  agregarVenta(orden: Orden) {
  const fecha = orden.formatoFecha();

  // Agrega solo la orden actual en memoria
  if (!this._ventasPorDia[fecha]) {
    this._ventasPorDia[fecha] = [];
  }

  this._ventasPorDia[fecha].push(orden);

  // Y guarda solo esa nueva orden en el localStorage
  serializarOrden(orden);
  this.guardarEnFirestore(orden);
}


  obtenerVentasPorFecha(fecha: Date): Orden[] {
    return deserializarOrden(fecha);
  }

  async guardarEnFirestore(orden: Orden) {
    try {
      const ordenObj = orden.toJSON ? orden.toJSON() : JSON.parse(JSON.stringify(orden));
      await addDoc(collection(db, "ordenes"), ordenObj);
      console.log("Orden guardada en Firestore");
    } catch (e) {
      console.error("Error al guardar en Firestore:", e);
    }
  }

}
