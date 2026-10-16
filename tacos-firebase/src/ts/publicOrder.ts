import { Orden } from "./orden";
import { SubOrden } from "./subOrden";

const WHATSAPP_NUMBER = "523133297441";

const productFields = [
  { id: "puerco", category: "tacos", product: "Tacos de Carne de puerco" },
  { id: "chicharron", category: "tacos", product: "Tacos de Chicharrón" },
  { id: "papa", category: "tacos", product: "Tacos de Papa" },
  { id: "frijol", category: "tacos", product: "Tacos de Frijol" },
  { id: "mixtosT", category: "tacos", product: "Tacos Mixtos" },
  { id: "entamaladoR", category: "entamalados", product: "Ent. Carne de res" },
  { id: "entamaladoF", category: "entamalados", product: "Ent. Frijol" },
  { id: "entamaladoM", category: "entamalados", product: "Ent. Mixto" },
  { id: "aguaSGj", category: "bebidas", product: "Agua de jamaica G" },
  { id: "aguaSGh", category: "bebidas", product: "Agua de horchata G" },
  { id: "aguaSCHj", category: "bebidas", product: "Agua de jamaica CH" },
  { id: "aguaSCHh", category: "bebidas", product: "Agua de horchata CH" },
  { id: "bolsaAguaJ", category: "bebidas", product: "Bolsa de agua jamaica" },
  { id: "bolsaAguaH", category: "bebidas", product: "Bolsa de agua horchata" },
  { id: "refresco", category: "bebidas", product: "Refresco" },
  { id: "refresco600ml", category: "bebidas", product: "Refresco 600 ml" },
  { id: "cafe", category: "bebidas", product: "Café" },
  { id: "aguaBG", category: "bebidas", product: "Agua enbotellada G" },
  { id: "aguaBCH", category: "bebidas", product: "Agua enbotellada CH" }
] as const;

type ProductCategory = typeof productFields[number]["category"];

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`No se encontró el elemento requerido #${id}.`);
  }
  return element as T;
}

function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (
    date.getFullYear() !== Number(match[1]) ||
    date.getMonth() !== Number(match[2]) - 1 ||
    date.getDate() !== Number(match[3])
  ) {
    return null;
  }
  return date;
}

function setTodayAsMinimumDate(input: HTMLInputElement): void {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  input.min = localToday;
  input.value = localToday;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = getRequiredElement<HTMLFormElement>("ordenForm");
  const dateInput = getRequiredElement<HTMLInputElement>("fechaOrden");
  const nameInput = getRequiredElement<HTMLInputElement>("nombreCliente");
  const specificationsInput = getRequiredElement<HTMLTextAreaElement>("especificaciones");
  const totalOutput = getRequiredElement<HTMLOutputElement>("totalOrden");
  const status = getRequiredElement<HTMLElement>("estadoOrden");
  const fallbackLink = getRequiredElement<HTMLAnchorElement>("enlaceWhatsApp");
  setTodayAsMinimumDate(dateInput);

  const inputs = productFields.map((field) => ({
    ...field,
    input: getRequiredElement<HTMLInputElement>(field.id)
  }));

  function readProducts(): Record<ProductCategory, Record<string, number>> | null {
    const products: Record<ProductCategory, Record<string, number>> = {
      tacos: {},
      entamalados: {},
      bebidas: {}
    };
    let isValid = true;

    for (const field of inputs) {
      const quantity = field.input.value === "" ? 0 : field.input.valueAsNumber;
      if (!Number.isFinite(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
        field.input.setCustomValidity("Ingresa una cantidad entera igual o mayor a cero.");
        isValid = false;
        continue;
      }
      field.input.setCustomValidity("");
      products[field.category][field.product] = quantity;
    }

    return isValid ? products : null;
  }

  function updateTotal(): void {
    const products = readProducts();
    totalOutput.value = products
      ? `$${new SubOrden(products.tacos, products.entamalados, products.bebidas).getTotal()}`
      : "$—";
  }

  for (const field of inputs) {
    field.input.addEventListener("input", updateTotal);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    fallbackLink.hidden = true;

    if (!form.reportValidity()) return;
    const nombreCliente = nameInput.value.trim();
    if (!nombreCliente) {
      status.textContent = "Escribe tu nombre para identificar el pedido.";
      nameInput.focus();
      return;
    }

    const fecha = parseLocalDate(dateInput.value);
    if (!fecha) {
      status.textContent = "Selecciona una fecha válida para tu pedido.";
      dateInput.focus();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fecha < today) {
      status.textContent = "La fecha del pedido no puede ser anterior a hoy.";
      dateInput.focus();
      return;
    }

    const products = readProducts();
    if (!products) {
      status.textContent = "Revisa las cantidades de los productos.";
      return;
    }

    const subOrden = new SubOrden(products.tacos, products.entamalados, products.bebidas);
    if (subOrden.getTotal() <= 0) {
      status.textContent = "Agrega al menos un producto para continuar.";
      return;
    }

    const orden = new Orden({
      nombreCliente,
      fecha
    });
    orden.subOrdenes = [subOrden];
    orden.especificaciones = specificationsInput.value.trim();

    const details = [
      orden.formatoOrden(orden.fecha).trim(),
      orden.formatoSubOrdenesCombinadas(),
      orden.especificaciones ? `Especificaciones: ${orden.especificaciones}` : ""
    ].filter(Boolean);
    fallbackLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details.join("\n"))}`;
    fallbackLink.hidden = false;

    const whatsappWindow = window.open(fallbackLink.href, "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      status.textContent = "Se abrió WhatsApp con tu pedido preparado. Revísalo y envíalo para confirmarlo.";
    } else {
      status.textContent = "El navegador bloqueó la ventana. Usa el enlace para abrir WhatsApp con tu pedido.";
      fallbackLink.focus();
    }
  });

  updateTotal();
});
