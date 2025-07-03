import { SubOrden } from "./subOrden.js";
import { Orden } from "./orden.js";
export class Ordenes {
    _gestorVentas;
    _ordenes;
    _htmlBotonOrden;
    _htmlNumeroMesa;
    _htmlFechaOrden;
    _htmlSelectMesa;
    _htmlFormatoOrden;
    _htmlListaSubOrdenes;
    // Tacos
    _htmlPuerco;
    _htmlChicharron;
    _htmlPapa;
    _htmlFrijol;
    _htmlMixtosT;
    // Entamalados
    _htmlEntamaladoR;
    _htmlEntamaladoF;
    _htmlEntamaladoM;
    // Bebidas
    _htmlAguaSG;
    _htmlAguaSCH;
    _htmlRefresco;
    _htmlCafe;
    _htmlAguaBG;
    _htmlAguaBCH;
    // Lista de órdenes
    _htmlOrdenesLista;
    _htmlBotonSubOrden;
    constructor(gestorVentas) {
        this._gestorVentas = gestorVentas;
        this._ordenes = [];
        this._htmlBotonOrden = document.getElementById("agregarOrden");
        this._htmlNumeroMesa = document.getElementById("noMesa");
        this._htmlFechaOrden = document.getElementById("fechaOrden");
        this._htmlSelectMesa = document.getElementById("SelectorNoMesa");
        this._htmlFormatoOrden = document.getElementById("formatoOrden");
        this._htmlListaSubOrdenes = document.getElementById("listaSubOrdenes");
        // Tacos
        this._htmlPuerco = document.getElementById("puerco");
        this._htmlChicharron = document.getElementById("chicharron");
        this._htmlPapa = document.getElementById("papa");
        this._htmlFrijol = document.getElementById("frijol");
        this._htmlMixtosT = document.getElementById("mixtosT");
        // Entamalados
        this._htmlEntamaladoR = document.getElementById("entamaladoR");
        this._htmlEntamaladoF = document.getElementById("entamaladoF");
        this._htmlEntamaladoM = document.getElementById("entamaladoM");
        // Bebidas
        this._htmlAguaSG = document.getElementById("aguaSG");
        this._htmlAguaSCH = document.getElementById("aguaSCH");
        this._htmlRefresco = document.getElementById("refresco");
        this._htmlCafe = document.getElementById("cafe");
        this._htmlAguaBG = document.getElementById("aguaBG");
        this._htmlAguaBCH = document.getElementById("aguaBCH");
        // Botón para crear suborden
        this._htmlBotonSubOrden = document.getElementById("crearSubOrden");
        // Lista de órdenes
        this._htmlOrdenesLista = document.getElementById("ordenes");
        // Asignar el evento
        this._htmlBotonOrden.addEventListener('click', () => { this.crearOrden(); });
        this._htmlBotonSubOrden.addEventListener('click', () => { this.crearSubOrden(); });
        this._htmlSelectMesa.addEventListener('change', () => {
            const numeroMesa = Number(this._htmlSelectMesa.value);
            const ordenSeleccionada = this._ordenes.find(orden => orden.noMesa === numeroMesa);
            if (ordenSeleccionada) {
                this.btnEstadoOrden(ordenSeleccionada);
                this._htmlListaSubOrdenes.innerHTML = '';
                ordenSeleccionada.subOrdenes.forEach((subOrden, index) => {
                    const li = document.createElement('li');
                    this.mostrarSubOrdenes(ordenSeleccionada);
                });
            }
            else {
                this._htmlFormatoOrden.textContent = '';
                this._htmlListaSubOrdenes.innerHTML = '';
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////
    // Método para crear una nueva orden
    crearOrden() {
        const noMesa = Number(this._htmlNumeroMesa.value);
        const mesaExistente = this._ordenes.some(orden => orden.noMesa === noMesa);
        if (isNaN(noMesa) || noMesa <= 0 || mesaExistente || !Number.isInteger(noMesa)) {
            alert("Número de mesa inválido");
            return;
        }
        const fecha = new Date(this._htmlFechaOrden.value);
        if (isNaN(fecha.getTime())) {
            console.error("Fecha inválida");
            return;
        }
        const nuevaOrden = new Orden(noMesa, fecha);
        this._ordenes.push(nuevaOrden);
        this._ordenes.sort((a, b) => a.noMesa - b.noMesa);
        this.agregarOrdenSelector();
    }
    ////////////////////////////////////////////////////////////////////////////////////
    agregarOrdenSelector() {
        this._htmlSelectMesa.innerHTML = '';
        this._ordenes.forEach((orden) => {
            const option = document.createElement('option');
            option.value = orden.noMesa.toString();
            option.text = `${orden.noMesa}`;
            this.btnEstadoOrden(orden);
            this._htmlSelectMesa.appendChild(option);
        });
        this._htmlNumeroMesa.value = '';
        this._htmlFechaOrden.value = '';
    }
    ////////////////////////////////////////////////////////////////////////////////////
    crearSubOrden() {
        const tacos = {
            'Tacos de Carne de puerco': this.getSafeValue(this._htmlPuerco),
            'Tacos de Chicharrón': this.getSafeValue(this._htmlChicharron),
            'Tacos de Papa': this.getSafeValue(this._htmlPapa),
            'Tacos de Frijol': this.getSafeValue(this._htmlFrijol),
            'Tacos Mixtos': this.getSafeValue(this._htmlMixtosT)
        };
        const entamalados = {
            'Ent. Carne de res': this.getSafeValue(this._htmlEntamaladoR),
            'Ent. Frijol': this.getSafeValue(this._htmlEntamaladoF),
            'Ent. Mixto': this.getSafeValue(this._htmlEntamaladoM)
        };
        const bebidas = {
            'Agua de sabor G': this.getSafeValue(this._htmlAguaSG),
            'Agua de sabor CH': this.getSafeValue(this._htmlAguaSCH),
            'Refresco': this.getSafeValue(this._htmlRefresco),
            'Café': this.getSafeValue(this._htmlCafe),
            'Agua enbotellada G': this.getSafeValue(this._htmlAguaBG),
            'Agua enbotellada CH': this.getSafeValue(this._htmlAguaBCH)
        };
        const nuevaSubOrden = new SubOrden(tacos, entamalados, bebidas);
        const numeroMesa = Number(this._htmlSelectMesa.value);
        const orden = this._ordenes.find(ord => ord.noMesa === numeroMesa);
        if (orden) {
            orden.subOrdenes.push(nuevaSubOrden);
            this._htmlListaSubOrdenes.innerHTML = '';
            orden.subOrdenes.forEach((subOrden, index) => {
                const li = document.createElement('li');
                this.mostrarSubOrdenes(orden);
            });
            this.btnEstadoOrden(orden);
        }
        else {
            alert("No existe una orden con ese número de mesa.");
        }
        this.limpiarCampos();
    }
    ////////////////////////////////////////////////////////////////////////////////////
    limpiarCampos() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '0');
    }
    getSafeValue(input) {
        return isNaN(input.valueAsNumber) ? 0 : input.valueAsNumber;
    }
    ////////////////////////////////////////////////////////////////////////////////////
    // Método para mostrar el estado de la orden y permitir marcarla como pagada
    btnEstadoOrden(orden) {
        this._htmlFormatoOrden.innerHTML = '';
        let fecha = this.parseFechaLocal(orden.fecha.toISOString().split('T')[0]); // Asegúrate de que la fecha esté en formato local
        const hd = document.createElement('hd');
        hd.textContent = orden.formatoOrden(orden.noMesa, fecha);
        const btnEstado = document.createElement('button');
        btnEstado.textContent = 'Pagada';
        btnEstado.type = 'button';
        const btnEliminarOrden = document.createElement('button');
        btnEliminarOrden.textContent = 'Eliminar';
        btnEliminarOrden.type = 'button';
        btnEstado.addEventListener('click', () => {
            orden.estadoOrden = true;
            this._ordenes = this._ordenes.filter(o => o.noMesa !== orden.noMesa);
            this.actualizarSelectMesas();
            this._gestorVentas.agregarVenta(orden);
            alert(`Orden de mesa ${orden.noMesa} pagada`);
        });
        btnEliminarOrden.addEventListener('click', () => {
            this.eliminarOrden(orden);
            alert(`Orden de mesa ${orden.noMesa} eliminada`);
        });
        this._htmlFormatoOrden.appendChild(hd);
        this._htmlFormatoOrden.appendChild(document.createTextNode(' '));
        this._htmlFormatoOrden.appendChild(btnEstado);
        this._htmlFormatoOrden.appendChild(document.createTextNode(' '));
        this._htmlFormatoOrden.appendChild(btnEliminarOrden);
    }
    parseFechaLocal(fechaStr) {
        const [año, mes, dia] = fechaStr.split('-').map(Number);
        return new Date(año, mes - 1, dia); // mes - 1 porque empieza en 0
    }
    ////////////////////////////////////////////////////////////////////////////////////
    actualizarSelectMesas() {
        this._htmlSelectMesa.innerHTML = '';
        this._ordenes.forEach(o => {
            const option = document.createElement('option');
            option.value = o.noMesa.toString();
            option.text = o.noMesa.toString();
            this._htmlSelectMesa.appendChild(option);
        });
        if (this._ordenes.length > 0) {
            const primeraOrden = this._ordenes[0];
            this._htmlSelectMesa.value = primeraOrden.noMesa.toString();
            this.btnEstadoOrden(primeraOrden); // Vuelve a mostrar el estado de la orden
            this.mostrarSubOrdenes(primeraOrden); // Vuelve a mostrar las subórdenes
        }
        else {
            // Si ya no hay órdenes, limpia todo
            this._htmlFormatoOrden.innerHTML = '';
            this._htmlListaSubOrdenes.innerHTML = '';
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////
    // Método para eliminar una orden
    eliminarOrden(orden) {
        this._ordenes = this._ordenes.filter(o => o.noMesa !== orden.noMesa);
        this.actualizarSelectMesas();
    }
    ////////////////////////////////////////////////////////////////////////////////////
    mostrarSubOrdenes(orden) {
        this._htmlListaSubOrdenes.innerHTML = '';
        orden.subOrdenes.forEach((subOrden, index) => {
            const li = document.createElement('li');
            li.innerHTML = `SubOrden ${index + 1}: ${subOrden.formatoSubOrden()} <button type='button' class='btnEliminarSubOrden'>Eliminar</button>`;
            const btnEliminar = li.querySelector('.btnEliminarSubOrden');
            btnEliminar.addEventListener('click', () => {
                const idx = orden.subOrdenes.indexOf(subOrden);
                if (idx !== -1) {
                    orden.subOrdenes.splice(idx, 1);
                    this.mostrarSubOrdenes(orden); // Recursivamente vuelve a renderizar la lista
                    this._htmlFormatoOrden.innerHTML = orden.formatoOrden(orden.noMesa, orden.fecha);
                    this.btnEstadoOrden(orden);
                }
            });
            this._htmlListaSubOrdenes.appendChild(li);
        });
    }
}
