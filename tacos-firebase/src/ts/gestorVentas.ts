import {serializarOrden} from "./serializar";
import {Orden} from "./orden";
import { deserializarOrden} from "./serializar";
// import {GestorOrdenesFirestore} from "./gestorFirestore.ts";

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
  // GestorOrdenesFirestore.guardarEnFirestore(orden);
}


  obtenerVentasPorFecha(fecha: Date): Orden[] {
    return deserializarOrden(fecha);
  }

}
