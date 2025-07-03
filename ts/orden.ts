import {SubOrden} from "./subOrden.js";

export class Orden {
  private _subOrdenes: SubOrden[];
  private _mesa: number;
  private _fecha: Date;
  private _estadoOrden: boolean;

  constructor(mesa: number, fecha: Date) {
    this._mesa = mesa;
    this._fecha = fecha;
    this._subOrdenes = [];
    this._estadoOrden = false;
  }

  get noMesa() {
    return this._mesa;
  }

  get fecha() {
    return this._fecha;
  }

  get subOrdenes() {
    return this._subOrdenes;
  }

  set subOrdenes(subOrdenes: SubOrden[]) {
    this._subOrdenes = subOrdenes;
  }

  set estadoOrden(estado: boolean) {
    this._estadoOrden = estado;
  }
  get estadoOrden() {
    return this._estadoOrden;
  }


  getTotal(): number {
    let total = 0;
    for (const subOrden of this._subOrdenes) {
      total += subOrden.getTotal();
    }
    return total;
  }


  formatoOrden(noMesa: number, fecha: Date): string {
    return `Orden Mesa: ${noMesa}, Fecha: ${this.formatearFecha(fecha)} - Total: $${this.getTotal()}`;
  }

  private formatearFecha(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate() ;
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${diaSemana}/${dia}/${mes}/${año}`;
  }

  formatoFecha(): string {
    const dia = (this.fecha.getDate()).toString().padStart(2, '0');
    const mes = (this.fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = this.fecha.getFullYear();
    return `${año}-${mes}-${dia}`;
  }


  public static formatDate(date: Date) {
    const dia = (date.getDate()).toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const año = date.getFullYear();
    return `${año}-${mes}-${dia}`;
  }


  getResumenConsumoOrd(): Record<string, number> {
    const resumen: Record<string, number> = {};

    for (const sub of this._subOrdenes) {
      const resumenSub = sub.getResumenConsumoSub();

      for (const producto in resumenSub) {
        const cantidad = resumenSub[producto];
        if (!producto || isNaN(cantidad)) continue; // evitar errores

        resumen[producto] = (resumen[producto] || 0) + cantidad;
      }
    }

    return resumen;
  }


  public static fromJSON(obj: any): Orden {
    const fecha = new Date(obj._fecha);
    const orden = new Orden(obj._mesa, fecha);

    // Reconstruir subórdenes (si es que existen)
    orden.subOrdenes = obj._subOrdenes.map((s: any) =>
      SubOrden.fromJSON(s)
  );

    // Restaurar estado de la orden si venía en el objeto
    orden.estadoOrden = obj._estadoOrden ?? false;

    return orden;
  }

}