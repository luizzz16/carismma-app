export class Administrar {
    _gestor;
    _htmlSelectorFecha;
    _htmlbotonBuscarVenta;
    _htmlResultado;
    _htmlListaVentas;
    constructor(gestorVentas) {
        this._gestor = gestorVentas;
        this._htmlSelectorFecha = document.getElementById('selectorFecha');
        this._htmlbotonBuscarVenta = document.getElementById('btnBuscarVent');
        this._htmlResultado = document.querySelector('#resultadoVenta');
        this._htmlListaVentas = document.getElementById('listaVentas');
        this._htmlbotonBuscarVenta.addEventListener('click', () => {
            const fechaStr = this._htmlSelectorFecha.value;
            if (!fechaStr) {
                alert('Selecciona una fecha primero.');
                return;
            }
            this._htmlResultado.innerHTML = '';
            this._htmlListaVentas.innerHTML = '';
            const fecha = new Date(fechaStr);
            const ordenes = this._gestor.obtenerVentasPorFecha(fecha);
            if (ordenes.length === 0) {
                this._htmlResultado.innerHTML = '<p>No hay ventas en esa fecha.</p>';
                return;
            }
            const resumenTotal = {};
            let totalOrden = 0;
            for (const orden of ordenes) {
                const resumenOrden = orden.getResumenConsumoOrd();
                totalOrden += orden.getTotal();
                for (const producto in resumenOrden) {
                    resumenTotal[producto] = (resumenTotal[producto] || 0) + resumenOrden[producto];
                }
            }
            this._htmlResultado.innerHTML = '<h3>Resumen de ventas</h3>';
            for (const producto in resumenTotal) {
                const li = document.createElement('li');
                li.textContent = `${producto}: ${resumenTotal[producto]}`;
                this._htmlListaVentas.appendChild(li);
            }
            const li = document.createElement('h3');
            li.textContent = `Total del día: $${totalOrden}`;
            this._htmlListaVentas.appendChild(li);
            this._htmlResultado.appendChild(this._htmlListaVentas);
        });
    }
}
