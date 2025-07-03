import { serializarOrden } from "./serializar.js";
import { deserializarOrden } from "./serializar.js";
export class GestorVentas {
    _ventasPorDia = {};
    // private _ventasPorSemana: Record<string, Orden[]> = {};
    agregarVenta(orden) {
        const fecha = orden.formatoFecha();
        // Agrega solo la orden actual en memoria
        if (!this._ventasPorDia[fecha]) {
            this._ventasPorDia[fecha] = [];
        }
        this._ventasPorDia[fecha].push(orden);
        // Y guarda solo esa nueva orden en el localStorage
        serializarOrden(orden);
    }
    obtenerVentasPorFecha(fecha) {
        return deserializarOrden(fecha);
    }
}
