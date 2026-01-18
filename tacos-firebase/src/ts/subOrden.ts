export class SubOrden {
  private _tacos: Record<string, number>;
  private _entamalados: Record<string, number>;
  private _bebidas: Record<string, number>;
  private id: string | null = null;
  private _especificacionesSub: string = '';
  // opciones?: { id?: string; especificacionesSub?: string }

  constructor(
    tacos: Record<string, number>,
    entamalados: Record<string, number>,
    bebidas: Record<string, number>,
    // id?: string,
    // especificacionesSub: string = ''
    opciones?: { id?: string; especificacionesSub?: string }
  ) {
    this.id = opciones?.id || this.generarUUID();
    this._tacos = tacos;
    this._entamalados = entamalados;
    this._bebidas = bebidas;
    this._especificacionesSub = opciones?.especificacionesSub || '';
  }

  get tacos() {
    return this._tacos;
  }

  get entamalados() {
    return this._entamalados;
  } 

  get bebidas() {
    return this._bebidas;
  }

  get idSub() {
    return this.id;
  }

  get especificacionesSub() {
    return this._especificacionesSub;
  }

  private generarUUID(): string {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback manual (no criptográficamente seguro, pero funciona)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


  getTotal(): number {
    let total = 0;

    const preciosTacos: Record<string, number> = {
      'Tacos de Carne de puerco': 14,
      'Tacos de Chicharrón': 14,
      'Tacos de Papa': 14,
      'Tacos de Frijol': 14,
      'Tacos Mixtos': 18
    };

    const preciosEntamalados: Record<string, number> = {
      'Ent. Carne de res': 38,
      'Ent. Frijol': 30,
      'Ent. Mixto': 38
    };

    const preciosBebidas: Record<string, number> = {
      'Agua de jamaica G': 30,
      'Agua de horchata G': 30,
      'Agua de jamaica CH': 15,
      'Agua de horchata CH': 15,
      'Bolsa de agua jamaica': 20,
      'Bolsa de agua horchata': 20,
      'Refresco': 30,
      'Refresco 600 ml': 32,
      'Café': 30,
      'Agua enbotellada G': 20,
      'Agua enbotellada CH': 15
    };

    for (let key in this._tacos) {
      total += this._tacos[key] * preciosTacos[key];
    }

    for (let key in this._entamalados) {
      total += this._entamalados[key] * preciosEntamalados[key];
    }

    for (let key in this._bebidas) {
      total += this._bebidas[key] * preciosBebidas[key];
    }

    return total;
  }

  getResumenConsumoSub(): Record<string, number> {
    const resumen: Record<string, number> = {};

    const agrupar = (categoria: Record<string, number>) => {
      for (const tipo in categoria) {
        const cantidad = categoria[tipo];
        if (cantidad > 0) {
          resumen[tipo] = (resumen[tipo] || 0) + cantidad;
        }
      }
    };

    agrupar(this._tacos);
    agrupar(this._entamalados);
    agrupar(this._bebidas);

    return resumen;
  }



  public formatoSubOrden(): string {
    const partes = [
      this.formatoTacos(this._tacos),
      this.formatoEntamalados(this._entamalados),
      this.formatoBebidas(this._bebidas),
      `Total: $${this.getTotal()}`
    ].filter(p => p !== '' && p !== 'Total: $0');

    return partes.join(' | ');
  }

  formatoTacos(tacos: Record<string, number>): string {
    const abreviaturas: Record<string, string> = {
      'Tacos de Carne de puerco': 'TC',
      'Tacos de Chicharrón': 'TCH',
      'Tacos de Papa': 'TP',
      'Tacos de Frijol': 'TF',
      'Tacos Mixtos': 'TMX'
    };

    let resultado = '';

    for (let tipo in tacos) {
      const cantidad = tacos[tipo];
      if (cantidad > 0) {
        resultado += `${cantidad}${abreviaturas[tipo]} `;
      }
    }
    return resultado.trim();
  }

  formatoEntamalados(entamalados: Record<string, number>): string {
    const abreviaturas: Record<string, string> = {
      'Ent. Carne de res': 'EC',
      'Ent. Frijol': 'EF',
      'Ent. Mixto': 'EMX'
    };

    let resultado = '';

    for (let tipo in entamalados) {
      const cantidad = entamalados[tipo];
      if (cantidad > 0) {
        resultado += `${cantidad}${abreviaturas[tipo]} `;
      }
    }
    return resultado.trim();
  }

  formatoBebidas(bebidas: Record<string, number>): string {
    const abreviaturas: Record<string, string> = {
      'Agua de jamaica G': 'ASGj',
      'Agua de horchata G': 'ASGh',
      'Agua de jamaica CH': 'ASCHj',
      'Agua de horchata CH': 'ASCHh',
      'Bolsa de agua jamaica': 'BAj',
      'Bolsa de agua horchata': 'BAh',
      'Refresco': 'REF',
      'Refresco 600 ml': 'REF600ml',
      'Café': 'CAF',
      'Agua enbotellada G': 'ABG',
      'Agua enbotellada CH': 'ABCH'
    };

    let resultado = '';

    for (let tipo in bebidas) {
      const cantidad = bebidas[tipo];
      if (cantidad > 0) {
        resultado += `${cantidad}${abreviaturas[tipo]} `;
      }
    }
    return resultado.trim();
  }

  // public static fromJSON(obj: any): SubOrden {
  //   return new SubOrden(obj._tacos, obj._entamalados, obj._bebidas);
  // }

  public static fromJSON(obj: any): SubOrden {
  return new SubOrden(
    obj._tacos ?? obj.tacos,
    obj._entamalados ?? obj.entamalados,
    obj._bebidas ?? obj.bebidas,
    // // obj.id ?? null,
    // obj._especificacionesSub
    {
      id: obj.id ?? null,
      especificacionesSub: obj._especificacionesSub ?? ''
    }
  );
}


  public toJSON(): any {
    return {
      id: this.id ?? null,
      _tacos: this._tacos,
      _entamalados: this._entamalados,
      _bebidas: this._bebidas,
      _especificacionesSub: this._especificacionesSub
    };
  }
} 