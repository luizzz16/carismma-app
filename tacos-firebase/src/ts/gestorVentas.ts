import {Orden} from "./orden";
import {GestorOrdenesFirestore} from "./gestorFirestore.ts";

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

  GestorOrdenesFirestore.cambiarEstadoOrden(orden.id)
    .then(() => {
      console.log("Nuevo estado de orden: PAGADA");
    })
    .catch((error) => {
      console.error("Error al guardar la orden en Firestore:", error);
    });
  }

  async obternerVentasPorFecha(fecha: Date) {
    return await GestorOrdenesFirestore.obtenerOrdenesPorFecha(fecha);
  }

}


