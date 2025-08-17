import {SubOrden} from "./subOrden";

export class Orden {
  public id: string = '';
  private _subOrdenes: SubOrden[];
  private _mesa?: number;
  private _nombreCliente?: string = '';
  private _fecha: Date;
  private _ordenCreacionTiempo: number;
  private _estadoOrden: boolean;
  private _especificaciones: string = '';
  private _ordenHecha: boolean;

  constructor(opciones: { mesa?: number; nombreCliente?: string; fecha: Date }) {
    this._mesa = opciones.mesa;
    this._nombreCliente = opciones.nombreCliente ?? '';
    this._fecha = opciones.fecha;
    this._ordenCreacionTiempo = Date.now();
    this._subOrdenes = [];
    this._estadoOrden = false;
    this._ordenHecha = false;
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

  get especificaciones() {
    return this._especificaciones;
  }

  set especificaciones(especificaciones: string) {
    this._especificaciones = especificaciones;
  } 

  get nombreCliente() {
    return this._nombreCliente;
  }

  set ordenHecha(hecha: boolean) {
    this._ordenHecha = hecha;
  }

  get ordenHecha() {
  return this._ordenHecha;
}


  getTotal(): number {
    let total = 0;
    for (const subOrden of this._subOrdenes) {
      total += subOrden.getTotal();
    }
    return total;
  }


  // formatoOrden(noMesa: number, fecha: Date): string {
  //   return `Orden Mesa: ${noMesa}, Fecha: ${this.formatearFecha(fecha)} - Total: $${this.getTotal()}`;
  // }

  formatoOrden(fecha: Date): string {
  const tieneNombre = this.nombreCliente && this.nombreCliente.trim() !== '';

  const tipo = tieneNombre
    ? `Orden ${this.noMesa} Cliente: ${this.nombreCliente!.trim()}`
    : `Mesa: ${this.noMesa}`;

  return ` ${tipo}, Fecha: ${this.formatearFecha(fecha)} - Total: $${this.getTotal()}`;
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


  getResumenConsumoOrd(): Record<string, number> {
    const resumen: Record<string, number> = {};

    for (const sub of this._subOrdenes) {
      const resumenSub = sub.getResumenConsumoSub();
      for (const producto in resumenSub) {
        const cantidad = resumenSub[producto];
        if (!producto || isNaN(cantidad)) continue;
          resumen[producto] = (resumen[producto] || 0) + cantidad;
        }
      }
      return resumen;
    }

  formatoSubOrdenesCombinadas(): string {
    const totalTacos: Record<string, number> = {};
    const totalEntamalados: Record<string, number> = {};
    const totalBebidas: Record<string, number> = {};
    let total = 0;

    // Filtra subórdenes válidas
    const subOrdenesValidas = this._subOrdenes.filter(s =>
      s &&
      typeof s.formatoTacos === 'function' &&
      typeof s.formatoEntamalados === 'function' &&
      typeof s.formatoBebidas === 'function' &&
      typeof s.getTotal === 'function'
    );

    for (const subOrden of subOrdenesValidas) {
      for (const tipo in subOrden.tacos) {
        totalTacos[tipo] = (totalTacos[tipo] || 0) + subOrden.tacos[tipo];
      }

      for (const tipo in subOrden.entamalados) {
        totalEntamalados[tipo] = (totalEntamalados[tipo] || 0) + subOrden.entamalados[tipo];
      }

      for (const tipo in subOrden.bebidas) {
        totalBebidas[tipo] = (totalBebidas[tipo] || 0) + subOrden.bebidas[tipo];
      }

      total += subOrden.getTotal();
    }

    // Usar la primera suborden válida como referencia
    const subOrdenRef = subOrdenesValidas[0];

    if (!subOrdenRef) {
      return `Total: $${total}`;
    }

    const partes = [
      subOrdenRef.formatoTacos(totalTacos),
      subOrdenRef.formatoEntamalados(totalEntamalados),
      subOrdenRef.formatoBebidas(totalBebidas),
      `Total: $${total}`
    ].filter(p => p !== '' && p !== 'Total: $0');

    return partes.join(' | ');
  }




  public static fromJSON(obj: any): Orden {
    const fecha = obj.fecha?.toDate?.() || new Date(obj.fecha);
    const orden = new Orden({ mesa: obj._mesa ?? obj.noMesa, nombreCliente: obj._nombreCliente ?? obj.nombreCliente, fecha: fecha});
    orden.id = obj.id?.toString() ?? '';

    const subOrdenesJson = obj._subOrdenes;

    orden._ordenCreacionTiempo = obj._ordenCreacionTiempo ?? Date.now();

    orden.subOrdenes = Array.isArray(subOrdenesJson)
      ? subOrdenesJson.map((s: any) => SubOrden.fromJSON(s))
      : [];

    orden.estadoOrden = obj._estadoOrden ?? obj.estadoOrden ?? false;
    orden._ordenHecha = obj._ordenHecha ?? false;
    orden._especificaciones = obj._especificaciones ?? obj.especificaciones ?? '';

    return orden;
  }

  toJSON() {
    const json: any = {
      id: this.id ?? null,
      _estadoOrden: this.estadoOrden,
      _ordenHecha: this._ordenHecha,
      _ordenCreacionTiempo: this._ordenCreacionTiempo,
      _subOrdenes: this._subOrdenes.map(sub => sub.toJSON()),
      _especificaciones: this._especificaciones,
      _nombreCliente: this._nombreCliente ?? ''
    };

    // Solo incluir _mesa si tiene un valor válido
    if (this._mesa !== undefined) {
      json._mesa = this._mesa;
    }

    return json;
  }
}