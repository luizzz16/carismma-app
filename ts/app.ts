import { GestorVentas } from './gestorVentas.js';
import { Ordenes } from './ordenes.js';

document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorVentas();
  new Ordenes(gestor);
});


