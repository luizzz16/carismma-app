import { GestorVentas } from './gestorVentas';
import { Administrar } from './administrar';

document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorVentas();
  new Administrar(gestor);
});
