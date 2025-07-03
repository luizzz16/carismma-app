import { serializarOrden } from "./serializar.js";
import { Orden } from "./orden.js";
import { deserializarOrden } from "./serializar.js";

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
}


  obtenerVentasPorFecha(fecha: Date): Orden[] {
    return deserializarOrden(fecha);
  }

  // mostrarVentasPorFecha(fecha: Date) {
  //   const fechaStr = fecha.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  //   const ordenes = this.obtenerVentasPorFecha(fecha);
    
  //   if (ordenes.length === 0) {
  //     console.log(`No hay ventas para la fecha ${fechaStr}`);
  //     return;
  //   }

  //   console.log(`Ventas para la fecha ${fechaStr}:`);
  //   ordenes.forEach(orden => {
  //     console.log(`Mesa: ${orden.noMesa}, Total: ${orden.getResumenConsumoOrd()}`);
  //   });
  // }

}
