import {SubOrden} from "./subOrden";
import {Orden} from "./orden";
import {GestorVentas} from "./gestorVentas";
import {GestorOrdenesFirestore} from "./gestorFirestore.ts";

export class Ordenes {
  private _gestorVentas: GestorVentas;
  private _ordenes: Orden[];
  private _htmlBotonOrden: HTMLButtonElement;
  // private _BotonOrdenParaLlevar: HTMLButtonElement;
  private _htmlNumeroMesa: HTMLInputElement;
  private _htmlNombreCliente: HTMLInputElement;
  private _htmlFechaOrden: HTMLInputElement;
  private _htmlSelectMesa: HTMLSelectElement;
  // private _htmlSelectCliente: HTMLSelectElement;
  private _htmlFormatoOrden: HTMLHeadingElement;
  private _htmlEspecificaciones: HTMLTextAreaElement;
  private _htmlBotonEspecificaciones: HTMLButtonElement;
  private _htmlListaSubOrdenes: HTMLOListElement;
  // Tacos
  private _htmlPuerco: HTMLInputElement;
  private _htmlChicharron: HTMLInputElement;
  private _htmlPapa: HTMLInputElement;
  private _htmlFrijol: HTMLInputElement;
  private _htmlMixtosT: HTMLInputElement;
  // Entamalados
  private _htmlEntamaladoR: HTMLInputElement;
  private _htmlEntamaladoF: HTMLInputElement;
  private _htmlEntamaladoM: HTMLInputElement;
  // Bebidas
  private _htmlAguaSG: HTMLInputElement;
  private _htmlAguaSCH: HTMLInputElement;
  private _htmlRefresco: HTMLInputElement;
  private _htmlCafe: HTMLInputElement;
  private _htmlAguaBG: HTMLInputElement;
  private _htmlAguaBCH: HTMLInputElement;
  // Lista de órdenes
  // private _htmlOrdenesLista: HTMLUListElement;
  private _htmlespecificacionesSub: HTMLInputElement;
  private _htmlBotonSubOrden: HTMLButtonElement;
  private _htmlBtnBuscarOrdenPagada: HTMLButtonElement;
  private _htmlFechaOrdenPagada: HTMLInputElement;
  private _htmlOrdenesPagadas: HTMLOListElement;

  constructor(gestorVentas: GestorVentas) {
    //firestore
    this.escucharOrdenesFirestore();

    this._gestorVentas = gestorVentas;
    this._ordenes = [];

    this._htmlBotonOrden = document.getElementById("agregarOrden") as HTMLButtonElement;
    // this._BotonOrdenParaLlevar = document.getElementById("agregarOrdenParaLlevar") as HTMLButtonElement;
    this._htmlNumeroMesa = document.getElementById("noMesa") as HTMLInputElement;
    this._htmlNombreCliente = document.getElementById("nombreCliente") as HTMLInputElement;
    this._htmlFechaOrden = document.getElementById("fechaOrden") as HTMLInputElement;
    this._htmlSelectMesa = document.getElementById("SelectorNoMesa") as HTMLSelectElement;
    // this._htmlSelectCliente = document.getElementById("selectCliente") as HTMLSelectElement;
    this._htmlFormatoOrden = document.getElementById("formatoOrden") as HTMLHeadingElement;
    this._htmlEspecificaciones = document.getElementById("especificaciones") as HTMLTextAreaElement;
    this._htmlBotonEspecificaciones = document.getElementById("mostrarEspecificaciones") as HTMLButtonElement;
    this._htmlListaSubOrdenes = document.getElementById("listaSubOrdenes") as HTMLOListElement;

    // Tacos
    this._htmlPuerco = document.getElementById("puerco") as HTMLInputElement;
    this._htmlChicharron = document.getElementById("chicharron") as HTMLInputElement;
    this._htmlPapa = document.getElementById("papa") as HTMLInputElement;
    this._htmlFrijol = document.getElementById("frijol") as HTMLInputElement;
    this._htmlMixtosT = document.getElementById("mixtosT") as HTMLInputElement;

    // Entamalados
    this._htmlEntamaladoR = document.getElementById("entamaladoR") as HTMLInputElement;
    this._htmlEntamaladoF = document.getElementById("entamaladoF") as HTMLInputElement;
    this._htmlEntamaladoM = document.getElementById("entamaladoM") as HTMLInputElement;

    // Bebidas
    this._htmlAguaSG = document.getElementById("aguaSG") as HTMLInputElement;
    this._htmlAguaSCH = document.getElementById("aguaSCH") as HTMLInputElement;
    this._htmlRefresco = document.getElementById("refresco") as HTMLInputElement;
    this._htmlCafe = document.getElementById("cafe") as HTMLInputElement;
    this._htmlAguaBG = document.getElementById("aguaBG") as HTMLInputElement;
    this._htmlAguaBCH = document.getElementById("aguaBCH") as HTMLInputElement;

    this._htmlespecificacionesSub = document.getElementById("especificacionesSub") as HTMLInputElement;
    // Botón para crear suborden
    this._htmlBotonSubOrden = document.getElementById("crearSubOrden") as HTMLButtonElement;

    this._htmlFechaOrdenPagada = document.getElementById("fechaOrdenPagada") as HTMLInputElement;
    this._htmlBtnBuscarOrdenPagada = document.getElementById("btnBuscarOrdenPagada") as HTMLButtonElement;

    // Lista de órdenes
    this._htmlOrdenesPagadas = document.getElementById("ordenesPagadas") as HTMLOListElement;

    // Asignar el evento
    this._htmlBotonOrden.addEventListener('click', () => {this.crearOrden();});

    this._htmlBotonSubOrden.addEventListener('click', () => {this.crearSubOrden();});

    this._htmlSelectMesa.addEventListener('change', () => {
      const numeroMesa = Number(this._htmlSelectMesa.value);
      const ordenSeleccionada = this._ordenes.find(orden => orden.noMesa === numeroMesa);
      if (ordenSeleccionada) {
        this.btnEstadoOrden(ordenSeleccionada);
        this._htmlListaSubOrdenes.innerHTML = '';
        this.mostrarSubOrdenes(ordenSeleccionada);
        this.mostrarEspecificaciones(ordenSeleccionada);
      } else {
        this._htmlFormatoOrden.textContent = '';
        this._htmlListaSubOrdenes.innerHTML = '';
        this._htmlEspecificaciones.value = '';
      }
    });

    // this._htmlSelectCliente.addEventListener('change', () => {
    //   const nombreCliente = this._htmlSelectCliente.value.trim();
    //   const ordenSeleccionada = this._ordenes.find(orden => orden.nombreCliente?.trim() === nombreCliente);
    //   if (ordenSeleccionada) {
    //     this.btnEstadoOrden(ordenSeleccionada);
    //     this._htmlListaSubOrdenes.innerHTML = '';
    //     this.mostrarSubOrdenes(ordenSeleccionada);
    //     this.mostrarEspecificaciones(ordenSeleccionada);
    //   } else {
    //     this._htmlFormatoOrden.textContent = '';
    //     this._htmlListaSubOrdenes.innerHTML = '';
    //     this._htmlEspecificaciones.value = '';
    //   }
    // });



  this._htmlBotonEspecificaciones.addEventListener("click", async () => {
    const orden = this._ordenes.find(o => o.noMesa?.toString()  === this._htmlSelectMesa.value);
    if (orden && orden.id) {
      const texto = this._htmlEspecificaciones.value;
      await GestorOrdenesFirestore.actualizarEspecificaciones(orden.id, texto);
      orden.especificaciones = texto;
      alert("Especificaciones actualizadas");
    }
  });

  this._htmlBtnBuscarOrdenPagada.addEventListener('click', async () => {
    let fechaStr = this._htmlFechaOrdenPagada.value;
    if (!fechaStr) {
      alert('Selecciona una fecha primero.');
      return;
    }
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) {
      alert('Fecha inválida.');
      return;
    }
    this._htmlOrdenesPagadas.innerHTML = '';
    const ordenes = await this._gestorVentas.obternerVentasPorFecha(fecha);
    ordenes.forEach((ordn) => {
      const tieneNombre = ordn.nombreCliente && ordn.nombreCliente.trim() !== '';

      const tipo = tieneNombre
      ? `Orden ${ordn.noMesa} Cliente: ${ordn.nombreCliente!.trim()}`
      : `Mesa: ${ordn.noMesa}`;

        const resumen = ordn.formatoSubOrdenesCombinadas();
        const li = document.createElement('li');
        li.textContent = `${tipo} | ${resumen}`;
        this._htmlOrdenesPagadas.appendChild(li);
      });
    });

  }


    ////////////////////////////////////////////////////////////////////////////////////
    //Método para crear una nueva orden
    async crearOrden() {
      const noMesa = Number(this._htmlNumeroMesa.value);
      const nCliente = this._htmlNombreCliente.value.trim();
      const mesaExistente = this._ordenes.some(orden => orden.noMesa === noMesa);
        if (isNaN(noMesa) || noMesa <= 0 || mesaExistente || !Number.isInteger(noMesa)) {
          alert("Número de mesa inválido");
          return;
        }
        if (!this._htmlFechaOrden.value) {
          alert("Fecha de orden es requerida");
          return;
        }
      const fecha = new Date(this._htmlFechaOrden.value);
        if (isNaN(fecha.getTime())) {
          console.error("Fecha inválida");
          return;
        }
      const nuevaOrden = new Orden({ mesa: noMesa, nombreCliente: nCliente, fecha: fecha });
      this._ordenes.push(nuevaOrden);
      this.agregarOrdenSelector();
      this._htmlSelectMesa.value = noMesa.toString();
      this._htmlListaSubOrdenes.innerHTML = '';
      // nuevaOrden.especificaciones = this._htmlEspecificaciones.value;
      this.btnEstadoOrden(nuevaOrden);
      this.mostrarSubOrdenes(nuevaOrden);
      this.mostrarEspecificaciones(nuevaOrden);
      this._htmlNombreCliente.value = ''; // Limpiar el campo de nombre del cliente

      // Guardar en Firestore (con await por seguridad)
      try {
        await GestorOrdenesFirestore.guardarOrden(nuevaOrden);
      } catch (error) {
        console.error("Error al guardar la orden en Firestore:", error);
        alert("Hubo un error al guardar la orden. Intenta nuevamente.");
      }
      // GestorOrdenesFirestore.guardarOrden(nuevaOrden);
    }

  // async crearOrden() {
  //   const noMesa = Number(this._htmlNumeroMesa.value);
  //   const nombreCliente = this._htmlNombreCliente.value?.trim();
  //   const fechaInput = this._htmlFechaOrden.value;

  //   // Validación de fecha
  //   if (!fechaInput) {
  //     alert("Fecha de orden es requerida");
  //     return;
  //   }

  //   const fecha = new Date(fechaInput);
  //   if (isNaN(fecha.getTime())) {
  //     alert("Fecha inválida");
  //     return;
  //   }

  //   let nuevaOrden: Orden;

  //   if (nombreCliente) {
  //     // Es un pedido para llevar
  //     nuevaOrden = new Orden({ nombreCliente, fecha });
  //   } else if (!isNaN(noMesa) && noMesa > 0 && Number.isInteger(noMesa)) {
  //     // Es un pedido en mesa
  //     const mesaExistente = this._ordenes.some(orden => orden.noMesa === noMesa);
  //     if (mesaExistente) {
  //       alert("La mesa ya tiene una orden activa.");
  //       return;
  //     }
  //     nuevaOrden = new Orden({ mesa: noMesa, fecha });
  //   } else {
  //     alert("Debes ingresar un número de mesa válido o un nombre de cliente para llevar.");
  //     return;
  //   }

  //   this._ordenes.push(nuevaOrden);

  //   // Mostrar en el selector correspondiente
  //   if (nuevaOrden.noMesa !== undefined) {
  //     this.agregarOrdenSelector(); // Para mesas
  //     this._htmlSelectMesa.value = noMesa.toString();
  //   } else {
  //     this.llenarSelectClientes(); // Para llevar
  //     this._htmlSelectCliente.value = nombreCliente;
  //   }

  //   this._htmlListaSubOrdenes.innerHTML = '';
  //   this.btnEstadoOrden(nuevaOrden);
  //   this.mostrarSubOrdenes(nuevaOrden);
  //   this.mostrarEspecificaciones(nuevaOrden);

  //   // Guardar en Firestore
  //   try {
  //     await GestorOrdenesFirestore.guardarOrden(nuevaOrden);
  //   } catch (error) {
  //     console.error("Error al guardar la orden en Firestore:", error);
  //     alert("Hubo un error al guardar la orden. Intenta nuevamente.");
  //   }
  // }

  // async crearOrden() {
  //   const noMesa = Number(this._htmlNumeroMesa.value);
  //   const nombreCliente = this._htmlNombreCliente.value?.trim();
  //   const fechaInput = this._htmlFechaOrden.value;

  //   if (!fechaInput) {
  //     alert("Fecha de orden es requerida");
  //     return;
  //   }

  //   const fecha = new Date(fechaInput);
  //   if (isNaN(fecha.getTime())) {
  //     alert("Fecha inválida");
  //     return;
  //   }

  //   let nuevaOrden: Orden;

  //   if (nombreCliente) {
  //     nuevaOrden = new Orden({ nombreCliente, fecha });
  //   } else if (!isNaN(noMesa) && noMesa > 0 && Number.isInteger(noMesa)) {
  //     const mesaExistente = this._ordenes.some(orden => orden.noMesa === noMesa);
  //     if (mesaExistente) {
  //       alert("La mesa ya tiene una orden activa.");
  //       return;
  //     }
  //     nuevaOrden = new Orden({ mesa: noMesa, fecha });
  //   } else {
  //     alert("Debes ingresar un número de mesa válido o un nombre de cliente para llevar.");
  //     return;
  //   }

  //   this._ordenes.push(nuevaOrden);

  //   if (nuevaOrden.noMesa !== undefined) {
  //     this.agregarOrdenSelector(); // Para mesas
  //     this._htmlSelectMesa.value = noMesa.toString();
  //   } else {
  //     // Agregar directamente al select
  //     const option = document.createElement("option");
  //     option.value = nuevaOrden.nombreCliente!;
  //     option.textContent = nuevaOrden.nombreCliente!;
  //     this._htmlSelectCliente.appendChild(option);
  //     this._htmlSelectCliente.value = nuevaOrden.nombreCliente!;
  //   }

  //   this._htmlListaSubOrdenes.innerHTML = '';
  //   this.btnEstadoOrden(nuevaOrden);
  //   this.mostrarSubOrdenes(nuevaOrden);
  //   this.mostrarEspecificaciones(nuevaOrden);



  //   try {
  //     await GestorOrdenesFirestore.guardarOrden(nuevaOrden);
  //   } catch (error) {
  //     console.error("Error al guardar la orden en Firestore:", error);
  //     alert("Hubo un error al guardar la orden. Intenta nuevamente.");
  //   }
  // }


//   private escucharOrdenesFirestore() {
//   GestorOrdenesFirestore.escucharOrdenes((ordenesDesdeFirestore) => {
//     this._ordenes = ordenesDesdeFirestore;

//     const ordenesConMesa = this._ordenes.filter(o => o.noMesa !== undefined);
//     const mesaSeleccionada = this._htmlSelectMesa.value;
//     const clienteSeleccionado = this._htmlSelectCliente?.value;

//     if (ordenesConMesa.length > 0) {
//       // Modo selector por mesa
//       const ordenSeleccionada = this._ordenes.find(o => o.noMesa?.toString() === mesaSeleccionada);

//       this.agregarOrdenSelector(mesaSeleccionada);

//       if (ordenSeleccionada) {
//         this._htmlSelectMesa.value = ordenSeleccionada.noMesa?.toString() ?? '';
//         this.btnEstadoOrden(ordenSeleccionada);
//         this.mostrarSubOrdenes(ordenSeleccionada);
//         this.mostrarEspecificaciones(ordenSeleccionada);
//       } else {
//         const ultimaOrden = ordenesConMesa[ordenesConMesa.length - 1];
//         this._htmlSelectMesa.value = ultimaOrden.noMesa?.toString() ?? '';
//         this.btnEstadoOrden(ultimaOrden);
//         this.mostrarSubOrdenes(ultimaOrden);
//         this.mostrarEspecificaciones(ultimaOrden);
//       }

//       this.llenarSelectClientes(); // También actualiza el select de clientes
//     } else {
//       // Modo selector por cliente
//       this.llenarSelectClientes(clienteSeleccionado);

//       const ordenSeleccionada = this._ordenes.find(o => o.nombreCliente?.trim() === clienteSeleccionado);

//       if (ordenSeleccionada) {
//         this._htmlSelectCliente.value = ordenSeleccionada.nombreCliente?.trim() ?? '';
//         this.btnEstadoOrden(ordenSeleccionada);
//         this.mostrarSubOrdenes(ordenSeleccionada);
//         this.mostrarEspecificaciones(ordenSeleccionada);
//       } else if (this._ordenes.length > 0) {
//         const ultimaOrden = this._ordenes[this._ordenes.length - 1];
//         this._htmlSelectCliente.value = ultimaOrden.nombreCliente?.trim() ?? '';
//         this.btnEstadoOrden(ultimaOrden);
//         this.mostrarSubOrdenes(ultimaOrden);
//         this.mostrarEspecificaciones(ultimaOrden);
//       } else {
//         // No hay órdenes en absoluto
//         this._htmlSelectCliente.value = '';
//         this._htmlListaSubOrdenes.innerHTML = '';
//         this._htmlFormatoOrden.innerHTML = '';
//         this._htmlEspecificaciones.value = '';
//       }

//       this._htmlSelectMesa.innerHTML = ''; // Limpia el selector de mesa si no se usa
//     }
//   });
// }


  // private llenarSelectClientes(clienteSeleccionado?: string): void {
  //   if (!this._htmlSelectCliente) return;

  //   const nombresUnicos = Array.from(
  //     new Set(
  //       this._ordenes
  //         .map(o => o.nombreCliente?.trim() ?? '')
  //         .filter(nombre => nombre !== '')
  //     )
  //   ).sort();

  //   this._htmlSelectCliente.innerHTML = '';

  //   for (const nombre of nombresUnicos) {
  //     const option = document.createElement('option');
  //     option.value = nombre;
  //     option.textContent = nombre || 'Cliente sin nombre';
  //     if (clienteSeleccionado && clienteSeleccionado === nombre) {
  //       option.selected = true;
  //     }
  //     this._htmlSelectCliente.appendChild(option);
  //   }

  //   this._htmlNombreCliente.value = '';
  //   this._htmlFechaOrden.value = '';
  // }

//   private escucharOrdenesFirestore() {
//   GestorOrdenesFirestore.escucharOrdenes((ordenesDesdeFirestore) => {
//     this._ordenes = ordenesDesdeFirestore;

//     // Filtra solo las órdenes que tienen número de mesa
//     const ordenesConMesa = this._ordenes.filter(o => o.noMesa !== undefined);

//     if (ordenesConMesa.length > 0) {
//       // Llena el selector de mesas visualmente
//       this.agregarOrdenSelector(); // Asegúrate de que este método existe

//       // Obtiene la mesa seleccionada actualmente
//       const mesaSeleccionada = this._htmlSelectMesa.value;

//       // Busca la orden con esa mesa
//       const ordenSeleccionada = this._ordenes.find(
//         o => o.noMesa?.toString() === mesaSeleccionada
//       );

//       if (ordenSeleccionada) {
//         this._htmlSelectMesa.value = ordenSeleccionada.noMesa?.toString() ?? '';
//         this.btnEstadoOrden(ordenSeleccionada);
//         this.mostrarSubOrdenes(ordenSeleccionada);
//         this.mostrarEspecificaciones(ordenSeleccionada);
//       } else {
//         // Si no hay una orden con esa mesa seleccionada, selecciona la última con mesa
//         const ultimaOrden = ordenesConMesa[ordenesConMesa.length - 1];
//         this._htmlSelectMesa.value = ultimaOrden.noMesa?.toString() ?? '';
//         this.btnEstadoOrden(ultimaOrden);
//         this.mostrarSubOrdenes(ultimaOrden);
//         this.mostrarEspecificaciones(ultimaOrden);
//       }
//     } else {
//       // No hay órdenes con número de mesa
//       this._htmlSelectMesa.innerHTML = '';
//       this._htmlListaSubOrdenes.innerHTML = '';
//       this._htmlFormatoOrden.innerHTML = '';
//       this._htmlEspecificaciones.value = '';
//     }
//   });
// }

  private escucharOrdenesFirestore() {
    GestorOrdenesFirestore.escucharOrdenes((ordenesDesdeFirestore) => {
      this._ordenes = ordenesDesdeFirestore;

      // Obtener la mesa seleccionada actualmente en el selector
      const mesaSeleccionada = this._htmlSelectMesa.value;
      const ordenSeleccionada = this._ordenes.find(o => o.noMesa?.toString() === mesaSeleccionada);

      // Repintar el selector sin perder la selección previa
      this.agregarOrdenSelector(mesaSeleccionada);

      // Mostrar información según lo que esté seleccionado
      if (ordenSeleccionada) {
        // Si hay una orden seleccionada manualmente, mantenerla
        this._htmlSelectMesa.value = ordenSeleccionada.noMesa?.toString() ?? '';
        this.btnEstadoOrden(ordenSeleccionada);
        this.mostrarSubOrdenes(ordenSeleccionada);
        this.mostrarEspecificaciones(ordenSeleccionada);
      } else if (this._ordenes.length > 0) {
        // Si no hay selección válida, mostrar la última orden
        const ultimaOrden = this._ordenes[this._ordenes.length - 1];
        this._htmlSelectMesa.value = ultimaOrden.noMesa?.toString() ?? '';
        this.btnEstadoOrden(ultimaOrden);
        this.mostrarSubOrdenes(ultimaOrden);
        this.mostrarEspecificaciones(ultimaOrden);
      } else {
        // Si no hay órdenes, limpiar campos
        this._htmlSelectMesa.value = '';
        this._htmlListaSubOrdenes.innerHTML = '';
        this._htmlFormatoOrden.innerHTML = '';
        this._htmlEspecificaciones.value = '';
        this._htmlNombreCliente.value = '';
      }
    });
  }



  private agregarOrdenSelector(mesaSeleccionada?: string): void {
  this._htmlSelectMesa.innerHTML = '';

  // Para evitar órdenes duplicadas por número de mesa
  const ordenesPorMesa: Record<number, Orden> = {};

  for (const orden of this._ordenes) {
    if (orden.noMesa !== undefined && !(orden.noMesa in ordenesPorMesa)) {
      ordenesPorMesa[orden.noMesa] = orden;
    }
  }

  // Recorrer y agregar las opciones al <select>
  for (const noMesa in ordenesPorMesa) {
    const orden = ordenesPorMesa[+noMesa];

    const option = document.createElement('option');
    option.value = noMesa;

    // Formato dinámico del texto de la opción
    if (orden.nombreCliente && orden.nombreCliente.trim() !== '') {
      option.textContent = `Orden para llevar ${noMesa} - ${orden.nombreCliente.trim()}`;
    } else {
      option.textContent = `Mesa ${noMesa}`;
    }

    // Mantener selección si aplica
    if (mesaSeleccionada && mesaSeleccionada === noMesa) {
      option.selected = true;
    }

    this._htmlSelectMesa.appendChild(option);
  }

  // Limpiar campos del formulario
  this._htmlNumeroMesa.value = '';
  this._htmlFechaOrden.value = '';
  this._htmlNombreCliente.value = ''; // Usa .value porque es un input
}


  //   private agregarOrdenSelector(mesaSeleccionada?: string): void {
  //   this._htmlSelectMesa.innerHTML = '';

  //   const ordenesConMesa = this._ordenes.filter(o => o.noMesa !== undefined && o.nombreCliente == undefined);
  //   const mesasUnicas = Array.from(new Set(ordenesConMesa.map(o => o.noMesa)));

  //   for (const mesa of mesasUnicas) {
  //     const option = document.createElement('option');
  //     option.value = mesa?.toString() ?? '';
  //     option.textContent = `Mesa ${mesa}`;
  //     if (mesaSeleccionada && mesaSeleccionada === mesa?.toString()) {
  //       option.selected = true;
  //     }
  //     this._htmlSelectMesa.appendChild(option);
  //   }

  //   this._htmlNumeroMesa.value = '';
  //   this._htmlFechaOrden.value = '';
  //   this._htmlNombreCliente.innerHTML = '';
  // } 



  private mostrarEspecificaciones(orden: Orden) {
    this._htmlEspecificaciones.value = '';
    this._htmlEspecificaciones.value = orden.especificaciones;
  }


//   private agregarOrdenSelector(mesaSeleccionada?: string): void {
//   this._htmlSelectMesa.innerHTML = '';

//   const ordenesConMesa = this._ordenes.filter(o => o.noMesa !== undefined);

//   const mesasUnicas = Array.from(new Set(ordenesConMesa.map(o => o.noMesa)));

//   for (const mesa of mesasUnicas) {
//     const option = document.createElement('option');
//     option.value = mesa?.toString() ?? '';
//     option.textContent = `Mesa ${mesa}`;
//     if (mesaSeleccionada && mesaSeleccionada === mesa?.toString()) {
//       option.selected = true;
//     }
//     this._htmlSelectMesa.appendChild(option);
//   }

//   this._htmlNumeroMesa.value = '';
//   this._htmlFechaOrden.value = '';
// }


    ////////////////////////////////////////////////////////////////////////////////////
    async crearSubOrden() {
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


      const numeroMesa = Number(this._htmlSelectMesa.value);
      const orden = this._ordenes.find(ord => ord.noMesa === numeroMesa);

      const totalTacos = Object.values(tacos).reduce((acc, cantidad) => acc + cantidad, 0)
      const totalEntamalados = Object.values(entamalados).reduce((acc, cantidad) => acc + cantidad, 0);
      const totalBebidas = Object.values(bebidas).reduce((acc, cantidad) => acc + cantidad, 0);

      let contador = totalBebidas + totalEntamalados + totalTacos;

      if (contador <= 0) {
        alert("No se ha agregado nada a la suborden");
        return;
      }

      if (orden) {
        const especificacionesSub = this._htmlespecificacionesSub.value.trim();
        const nuevaSubOrden = new SubOrden(tacos, entamalados, bebidas, {especificacionesSub});
        console.log("especificacionesSub:", especificacionesSub);
        console.log("nuevaSubOrden:", nuevaSubOrden);
        // const numeroMesa = Number(this._htmlSelectMesa.value);
        orden.subOrdenes.push(nuevaSubOrden);

      this._htmlListaSubOrdenes.innerHTML = '';
      this._htmlespecificacionesSub.value = '';

      if (orden.id) {
        await GestorOrdenesFirestore.actualizarSubOrdenes(orden.id, orden.subOrdenes);
        let nuevaOrden = await GestorOrdenesFirestore.obtenerOrdenPorId(orden.id);
        if(nuevaOrden) {
          this.mostrarSubOrdenes(nuevaOrden);
          this.btnEstadoOrden(nuevaOrden);
          console.log("Subordes mostradas:", nuevaOrden);
          alert(`Suborden agregada a la orden de mesa ${orden.noMesa}`);
        } else {
          console.error("No se encontró la orden actualizada.");
        }
      } else {
        console.error("La orden no tiene un ID asignado.");
      }
    } else {
      alert("No existe una orden con ese número de mesa.");
    }
      this.limpiarCampos();
    }


    ////////////////////////////////////////////////////////////////////////////////////
    private limpiarCampos(): void {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="number"]');
    inputs.forEach(input => input.value = '');
    }

    private getSafeValue(input: HTMLInputElement): number {
      return isNaN(input.valueAsNumber) ? 0 : input.valueAsNumber;
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // Método para mostrar el estado de la orden y permitir marcarla como pagada
    private btnEstadoOrden(orden: Orden) {
    this._htmlFormatoOrden.innerHTML = '';
    let fecha = this.parseFechaLocal(orden.fecha.toISOString().split('T')[0]); // Asegúrate de que la fecha esté en formato local

    const hd = document.createElement('hd');
    hd.textContent = orden.formatoOrden(fecha);

    const btnEstado = document.createElement('button');
    btnEstado.textContent = 'Pagada';
    btnEstado.type = 'button';

    const btnEliminarOrden = document.createElement('button');
    btnEliminarOrden.textContent = 'Eliminar';
    btnEliminarOrden.type = 'button';

    btnEstado.addEventListener('click', () => {
      if (orden.subOrdenes.length === 0) {
        alert("La orden tiene que tener al menos una suborden para poder marcarla como pagada.");
        return;
      }
      orden.estadoOrden = true;
      this._ordenes = this._ordenes.filter(o => o.noMesa !== orden.noMesa);
      this.actualizarSelectMesas();
      this._gestorVentas.agregarVenta(orden);

      const tieneNombre = orden.nombreCliente && orden.nombreCliente.trim() !== '';
      const tipo = tieneNombre
      ? `Orden ${orden.noMesa} Cliente: ${orden.nombreCliente!.trim()} PAGADA`
      : `Orden mesa: ${orden.noMesa} PAGADA`;

      alert(tipo);
    });

    btnEliminarOrden.addEventListener('click', () => {
      this.eliminarOrden(orden);
      const tieneNombre = orden.nombreCliente && orden.nombreCliente.trim() !== '';
      const tipo = tieneNombre
      ? `Orden ${orden.noMesa} Cliente: ${orden.nombreCliente!.trim()} ELIMINADA`
      : `Orden mesa: ${orden.noMesa} ELIMINADA`;

      alert(tipo);
      GestorOrdenesFirestore.eliminarOrden(orden.id!);
    });

    this._htmlFormatoOrden.appendChild(hd);
    this._htmlFormatoOrden.appendChild(document.createTextNode(' '));
    this._htmlFormatoOrden.appendChild(btnEstado);
    this._htmlFormatoOrden.appendChild(document.createTextNode(' '));
    this._htmlFormatoOrden.appendChild(btnEliminarOrden);
  }

  private parseFechaLocal(fechaStr: string): Date {
    const [año, mes, dia] = fechaStr.split('-').map(Number);
    return new Date(año, mes - 1, dia); // mes - 1 porque empieza en 0
  }


    ////////////////////////////////////////////////////////////////////////////////////
    private actualizarSelectMesas(): void {
      const mesaSeleccionadaAntes = this._htmlSelectMesa.value;
      this._htmlSelectMesa.innerHTML = '';

      this._ordenes.forEach(o => {
        const option = document.createElement('option');
        option.value = o.noMesa?.toString() ?? '';
        option.text = o.noMesa?.toString() ?? '';
        this._htmlSelectMesa.appendChild(option);
      });

      const sigueExistiendo = this._ordenes.some(o => o.noMesa?.toString() === mesaSeleccionadaAntes);

      if (sigueExistiendo) {
        this._htmlSelectMesa.value = mesaSeleccionadaAntes;
        const ordenSeleccionada = this._ordenes.find(o => o.noMesa?.toString() === mesaSeleccionadaAntes);
        if (ordenSeleccionada) {
          this.btnEstadoOrden(ordenSeleccionada);
          this.mostrarSubOrdenes(ordenSeleccionada);
        }
      } else if (this._ordenes.length > 0) {
        const primeraOrden = this._ordenes[0];
        this._htmlSelectMesa.value = primeraOrden.noMesa?.toString() ?? '';
        this.btnEstadoOrden(primeraOrden);
        this.mostrarSubOrdenes(primeraOrden);
      } else {
        // Si ya no hay órdenes, limpia todo
        this._htmlFormatoOrden.innerHTML = '';
        this._htmlListaSubOrdenes.innerHTML = '';
      }
      // if (this._ordenes.length > 0) {
      //   const primeraOrden = this._ordenes[0];
      //   this._htmlSelectMesa.value = primeraOrden.noMesa.toString();
      //   this.btnEstadoOrden(primeraOrden); // Vuelve a mostrar el estado de la orden
      //   this.mostrarSubOrdenes(primeraOrden); // Vuelve a mostrar las subórdenes
      // } else {
      //   // Si ya no hay órdenes, limpia todo
      //   this._htmlFormatoOrden.innerHTML = '';
      //   this._htmlListaSubOrdenes.innerHTML = '';
      // }
  }


    ////////////////////////////////////////////////////////////////////////////////////
    // Método para eliminar una orden
    private eliminarOrden(orden: Orden) {
      this._ordenes = this._ordenes.filter(o => o.noMesa !== orden.noMesa);
      this.actualizarSelectMesas();
    }


    ////////////////////////////////////////////////////////////////////////////////////
    // private mostrarSubOrdenes(orden: Orden): void {
    //   this._htmlListaSubOrdenes.innerHTML = '';
    //   let especificaciones = this._htmlespecificacionesSub.value.trim();
    //   orden.subOrdenes.forEach((subOrden, index) => {

    //     console.log("¿Es instancia de SubOrden?", subOrden instanceof SubOrden);
    //     const li = document.createElement('li');
    //     li.innerHTML = `${especificaciones}, SubOrden ${index + 1}: ${subOrden.formatoSubOrden()} <button type='button' class='btnEliminarSubOrden'>Eliminar</button>`;
        
    //     const btnEliminar = li.querySelector('.btnEliminarSubOrden') as HTMLButtonElement;
    //     btnEliminar.addEventListener('click', () => {
    //       const idx = orden.subOrdenes.indexOf(subOrden);
    //       GestorOrdenesFirestore.eliminarSubOrden(orden.id!, subOrden.idSub!);
    //       if (idx !== -1) {
    //         orden.subOrdenes.splice(idx, 1);
    //         this.mostrarSubOrdenes(orden); // Recursivamente vuelve a renderizar la lista
    //         this._htmlFormatoOrden.innerHTML = orden.formatoOrden(orden.fecha);
    //         this.btnEstadoOrden(orden);
    //       }
    //     });
    //     this._htmlListaSubOrdenes.appendChild(li);
    //   });
    // }

  private mostrarSubOrdenes(orden: Orden): void {
    this._htmlListaSubOrdenes.innerHTML = '';

    orden.subOrdenes.forEach((subOrden, index) => {
      const li = document.createElement('li');

      const texto = `${subOrden.especificacionesSub ?? 'Sin especificaciones'} SubOrden ${index + 1}: ${subOrden.formatoSubOrden()}`;
      
      const spanTexto = document.createElement('span');
      spanTexto.textContent = texto;

      const btnEliminar = document.createElement('button');
      btnEliminar.type = 'button';
      btnEliminar.classList.add('btnEliminarSubOrden');
      btnEliminar.textContent = 'Eliminar';

      btnEliminar.addEventListener('click', () => {
        const idx = orden.subOrdenes.indexOf(subOrden);

        // Elimina de Firestore
        GestorOrdenesFirestore.eliminarSubOrden(orden.id!, subOrden.idSub!);

        // Elimina del array local y actualiza UI
        if (idx !== -1) {
          orden.subOrdenes.splice(idx, 1);
          this.mostrarSubOrdenes(orden);
          this._htmlFormatoOrden.innerHTML = orden.formatoOrden(orden.fecha);
          this.btnEstadoOrden(orden);
        }
      });

      li.appendChild(spanTexto);
      li.appendChild(btnEliminar);
      this._htmlListaSubOrdenes.appendChild(li);
    });
  }


}
