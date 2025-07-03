import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Orden } from './orden';
export function ensureFolder(path) {
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
}
const APPDATA = process.env.APPDATA ?? join(process.env.USERPROFILE ?? '', 'AppData', 'Roaming');
const APPFOLDER = join(APPDATA, 'tacos_carismma');
const ORDENES_FOLDER = join(APPFOLDER, 'ordenes');
ensureFolder(ORDENES_FOLDER);
const getDayFilePath = () => {
    return join(ORDENES_FOLDER, Orden.formatDate(new Date()) + '.json');
};
export function serializarOrden(orden) {
    const filePath = getDayFilePath();
    let fileData = { orders: [] };
    if (existsSync(filePath)) {
        try {
            const content = readFileSync(filePath, 'utf-8');
            fileData = JSON.parse(content);
        }
        catch (err) {
            console.error('⚠️ Error reading/parsing existing JSON file:', err);
            // You could log or reset to empty list here depending on needs
        }
    }
    fileData.orders.push(orden);
    writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
}
// export function deserializarOrdenes(date: Date) {
//     const filePath = getDayFilePath();
//     const data /*: {orders: [{}]}*/ = JSON.parse(readFileSync(filePath, 'utf-8'));
//     const ordenes: Orden[] = [];
//     data.orders.forEach((order) => {
//         const fecha = order.fecha;
//         const mesa = order.mesa;
//         ordenes.push(new Orden(mesa, fecha))
//     });
//     return ordenes;
// }
