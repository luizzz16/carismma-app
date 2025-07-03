import { Orden } from './orden.js';
// export function serializarOrden(orden: Orden): void {
//     const key = Orden.formatDate(orden.fecha);
//     const rawData = localStorage.getItem(key);
//     let fileData: { orders: Orden[] } = { orders: [] };
//     if (rawData) {
//       try {
//         const parsed = JSON.parse(rawData);
//         // Merge existing orders if the structure is valid
//         if (Array.isArray(parsed.orders)) {
//           fileData.orders = parsed.orders;
//         }
//       } catch (error) {
//         console.warn('Could not parse existing data in localStorage. Overwriting.');
//       }
//     }
//     // Add the new order 
//     fileData.orders.push(orden);
//     console.log(fileData);
//     // Save back to localStorage
//     localStorage.setItem(key, JSON.stringify(fileData));
//   }
export function serializarOrden(orden) {
    const key = Orden.formatDate(orden.fecha);
    const rawData = localStorage.getItem(key);
    let fileData = { orders: [] };
    if (rawData) {
        try {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed.orders)) {
                fileData.orders = parsed.orders;
            }
        }
        catch (error) {
            console.warn('No se pudo parsear el localStorage. Se sobrescribirá.');
        }
    }
    // Convertir a JSON plano
    const ordenJson = JSON.parse(JSON.stringify(orden));
    // Evitar duplicados (opcional pero recomendable)
    fileData.orders.push(ordenJson);
    localStorage.setItem(key, JSON.stringify(fileData));
}
export function deserializarOrden(date) {
    const key = Orden.formatDate(date);
    const rawData = localStorage.getItem(key);
    if (!rawData)
        return [];
    try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed.orders)) {
            return parsed.orders.map((obj) => Orden.fromJSON(obj));
        }
        return [];
    }
    catch (error) {
        return [];
    }
}
// export function deserializarOrden(date: Date): Orden[] {
//   const key = Orden.formatDate(date);
//   const rawData = localStorage.getItem(key);
//   let fileData: { orders: Orden[] } = { orders: [] };
//   if (rawData) {
//     try {
//       const parsed = JSON.parse(rawData);
//       if (Array.isArray(parsed.orders)) {
//         fileData.orders = parsed.orders;
//         return fileData.orders;
//       } else {
//           return [];
//       }
//     } catch (error) {
//       return [];
//     }
//   } else {
//       return [];
//   }
// }
