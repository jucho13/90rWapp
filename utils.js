import {dirname} from "path";
import { fileURLToPath } from "url";

export const __dirname=dirname(fileURLToPath(import.meta.url));


export async function validatePhoneNumber(numero) {
    const cleanedNumber = numero.split('@')[0];

    // Regex que valida que el número contenga solo dígitos
    const phoneRegex = /^\d+$/;
    const check=phoneRegex.test(cleanedNumber)
    if (check === true)
    {
        return  cleanedNumber;
    }

}
export async function validateMoreThanOneHourConnection(date) {
    const dateNow = Date.now();
    const oneHourInMilliseconds = 60 * 60 * 1000;

    // Calcula la diferencia entre la fecha actual y la fecha pasada como parámetro
    const difference = dateNow - new Date(date).getTime();
    console.log(difference);
    
    // Verifica si ha pasado un día

    if (!date){
        return true;
    }
    if (difference >= oneHourInMilliseconds) {
        return true; // Ha pasado más de una hora
    } else {
        return false; // No ha pasado una hora
    }
}
export async function generarMensajePedidos(pedidos) {
    let mensaje = "";

    // Obtener los últimos 10 pedidos
    const ultimosPedidos = pedidos.slice(-10);

    ultimosPedidos.forEach((pedido, index) => {
        mensaje += `Pedido ${index + 1}:\n`;
        mensaje += `Productos: ${pedido.productos.join(", ")}\n`;
        mensaje += `Importe: $${pedido.importe}\n`;
        mensaje += `Fecha: ${pedido.fecha.toLocaleString()}\n`;
        mensaje += "----------------------------\n";
    });

    return mensaje;
}

export async function recibirDateDevolverDia(date) {
    return date.getDate();
}
export async function sumarDias(fecha) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate());
    return nuevaFecha;
}

// Función para convertir el horario a un string
export async function obtenerHorarioString(horario) {
    if (horario === 10 || horario === 13) {
        return `${horario}:00hs-${horario + 3}:00hs`;
    }
    return `${horario}:00hs-${horario + 2}:00hs`;
}