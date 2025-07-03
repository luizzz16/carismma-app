import { GestorVentas } from './gestorVentas.js';
import { Administrar } from './administrar.js';
document.addEventListener('DOMContentLoaded', () => {
    const gestor = new GestorVentas();
    new Administrar(gestor);
});
