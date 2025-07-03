export class SubOrden {
  private _tacos: Record<string, number>;
  private _entamalados: Record<string, number>;
  private _bebidas: Record<string, number>;

  constructor(
    tacos: Record<string, number>,
    entamalados: Record<string, number>,
    bebidas: Record<string, number>
  ) {
    this._tacos = tacos;
    this._entamalados = entamalados;
    this._bebidas = bebidas;
  }

  getTotal(): number {
    let total = 0;

    const preciosTacos: Record<string, number> = {
      'Tacos de Carne de puerco': 13,
      'Tacos de Chicharrón': 13,
      'Tacos de Papa': 13,
      'Tacos de Frijol': 13,
      'Tacos Mixtos': 17
    };

    const preciosEntamalados: Record<string, number> = {
      'Ent. Carne de res': 35,
      'Ent. Frijol': 30,
      'Ent. Mixto': 35
    };

    const preciosBebidas: Record<string, number> = {
      'Agua de sabor G': 25,
      'Agua de sabor CH': 15,
      'Refresco': 25,
      'Café': 25,
      'Agua enbotellada G': 15,
      'Agua enbotellada CH': 10
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

  private formatoTacos(tacos: Record<string, number>): string {
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

  private formatoEntamalados(entamalados: Record<string, number>): string {
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

  private formatoBebidas(bebidas: Record<string, number>): string {
    const abreviaturas: Record<string, string> = {
      'Agua de sabor G': 'ASG',
      'Agua de sabor CH': 'ASCH',
      'Refresco': 'REF',
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

  public static fromJSON(obj: any): SubOrden {
    return new SubOrden(obj._tacos, obj._entamalados, obj._bebidas);
  }

} 