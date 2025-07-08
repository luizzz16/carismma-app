import { serializarOrden } from "./serializar.js";
import { deserializarOrden } from "./serializar.js";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./app.js";
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
        this.guardarEnFirestore(orden);
    }
    obtenerVentasPorFecha(fecha) {
        return deserializarOrden(fecha);
    }
    async guardarEnFirestore(orden) {
        try {
            const ordenObj = orden.toJSON ? orden.toJSON() : JSON.parse(JSON.stringify(orden));
            await addDoc(collection(db, "ordenes"), ordenObj);
            console.log("Orden guardada en Firestore");
        }
        catch (e) {
            console.error("Error al guardar en Firestore:", e);
        }
    }
}
