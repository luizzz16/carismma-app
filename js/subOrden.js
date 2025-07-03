export class SubOrden {
    _tacos;
    _entamalados;
    _bebidas;
    constructor(tacos, entamalados, bebidas) {
        this._tacos = tacos;
        this._entamalados = entamalados;
        this._bebidas = bebidas;
    }
    getTotal() {
        let total = 0;
        const preciosTacos = {
            'Tacos de Carne de puerco': 13,
            'Tacos de Chicharrón': 13,
            'Tacos de Papa': 13,
            'Tacos de Frijol': 13,
            'Tacos Mixtos': 17
        };
        const preciosEntamalados = {
            'Ent. Carne de res': 35,
            'Ent. Frijol': 30,
            'Ent. Mixto': 35
        };
        const preciosBebidas = {
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
    getResumenConsumoSub() {
        const resumen = {};
        const agrupar = (categoria) => {
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
    formatoSubOrden() {
        const partes = [
            this.formatoTacos(this._tacos),
            this.formatoEntamalados(this._entamalados),
            this.formatoBebidas(this._bebidas),
            `Total: $${this.getTotal()}`
        ].filter(p => p !== '' && p !== 'Total: $0');
        return partes.join(' | ');
    }
    formatoTacos(tacos) {
        const abreviaturas = {
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
    formatoEntamalados(entamalados) {
        const abreviaturas = {
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
    formatoBebidas(bebidas) {
        const abreviaturas = {
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
    static fromJSON(obj) {
        return new SubOrden(obj._tacos, obj._entamalados, obj._bebidas);
    }
}
