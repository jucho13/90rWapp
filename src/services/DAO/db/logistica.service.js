import cabinaModel from "./models/cabinaModel.js";
import pedidoModel from "./models/pedidoModel.js";

export default class logisticaService {
    // reservarPesoEnCabina= async(dia,peso,horario)=>{
    //     // Encuentra la cabina disponible en la fecha y horario indicados
    //     const cabinaEnDiaYHorario = await cabinaModel.findOne({ hora: horario, dia: dia });
    //     if (!cabinaEnDiaYHorario) {
    //         console.log('No hay cabina disponible para el horario y día seleccionados');
    //         return 'No hay cabina disponible para el horario y día seleccionados';
    //     }
    //     const pesoDisponible = parseInt(cabinaEnDiaYHorario.cabina); // La capacidad actual de la cabina
    //     if (pesoDisponible >= peso) {
    //         // Si hay suficiente espacio, se resta el peso de los productos
    //         const nuevoEspacio =parseInt(pesoDisponible - peso);
    //         await cabinaModel.updateOne(
    //             { hora: horario, dia: dia },
    //             { cabina: nuevoEspacio }
    //         );
    //         console.log(`Peso reservado con éxito. Capacidad restante: ${nuevoEspacio}kg`);
    //         return `Peso reservado con éxito. Capacidad restante: ${nuevoEspacio}kg`;
    //     }else if (cabinaEnDiaYHorario.estado===0){
    //         const nuevoEspacio =parseInt(pesoDisponible - peso);
    //         if(nuevoEspacio>100){
    //             console.log('No hay suficiente capacidad disponible para reservar el peso solicitado');
    //             return 'No hay suficiente capacidad disponible para reservar el peso solicitado';
    //         }
    //         await cabinaModel.updateOne(
    //             { hora: horario, dia: dia },
    //             { cabina: nuevoEspacio,estado: 1}
    //         );
    //         console.log(`Peso reservado con éxito. Ultimo pedido del horario`);
    //         return `Peso reservado con éxito. Ultimo pedido del horario`;
    //     }else {
    //         // Si no hay suficiente espacio, no se realiza la reserva
    //         console.log('No hay suficiente capacidad disponible para reservar el peso solicitado');
    //         return 'No hay suficiente capacidad disponible para reservar el peso solicitado';
    //     }
    // }
    reservarPesoEnCabina = async (dia, peso, horario) => {
        try {
            // Encuentra la cabina disponible en la fecha y horario indicados
            const cabinaEnDiaYHorario = await cabinaModel.findOne({ hora: horario, dia: dia });
            if (!cabinaEnDiaYHorario) {
                console.log('No hay cabina disponible para el horario y día seleccionados');
                return 'No hay cabina disponible para el horario y día seleccionados';
            }
    
            // Log de depuración: valores actuales de cabina y peso
            console.log('Cabina encontrada:', cabinaEnDiaYHorario);
            console.log('Peso solicitado:', peso);
    
            // Asegúrate de que peso y cabina sean números válidos
            const pesoDisponible = parseInt(cabinaEnDiaYHorario.cabina);
            const pesoSolicitado = parseInt(peso);
    
            // Log de depuración: verifica los valores convertidos
            console.log('Peso disponible:', pesoDisponible);
            console.log('Peso solicitado (convertido):', pesoSolicitado);
    
            // Verificar si los valores son válidos
            if (isNaN(pesoDisponible) || isNaN(pesoSolicitado)) {
                console.log('Error: los valores de peso o capacidad no son números válidos.');
                return 'Error: los valores de peso o capacidad no son números válidos.';
            }
    
            if (pesoDisponible >= pesoSolicitado) {
                // Si hay suficiente espacio, se resta el peso de los productos
                const nuevoEspacio = pesoDisponible - pesoSolicitado;
                await cabinaModel.updateOne(
                    { hora: horario, dia: dia },
                    { cabina: nuevoEspacio }
                );
                console.log(`Peso reservado con éxito. Capacidad restante: ${nuevoEspacio}kg`);
                return `Peso reservado con éxito. Capacidad restante: ${nuevoEspacio}kg`;
            } else if (cabinaEnDiaYHorario.estado === 0) {
                const nuevoEspacio = pesoDisponible - pesoSolicitado;
    
                // Verificar si el espacio es suficiente para el último pedido
                if (nuevoEspacio > 100) {
                    console.log('No hay suficiente capacidad disponible para reservar el peso solicitado');
                    return 'No hay suficiente capacidad disponible para reservar el peso solicitado';
                }
    
                // Actualizar cabina y estado
                await cabinaModel.updateOne(
                    { hora: horario, dia: dia },
                    { cabina: nuevoEspacio, estado: 1 }
                );
                console.log('Peso reservado con éxito. Último pedido del horario');
                return 'Peso reservado con éxito. Último pedido del horario';
            } else {
                // Si no hay suficiente espacio
                console.log('No hay suficiente capacidad disponible para reservar el peso solicitado');
                return 'No hay suficiente capacidad disponible para reservar el peso solicitado';
            }
        } catch (error) {
            console.log('Error al reservar peso en cabina:', error);
            return 'Ocurrió un error al procesar la reserva';
        }
    };
    
    
    getHorariosDisponiblesEnUnDia = async (dia) => {
        const nuevoDia = parseInt(dia); // Asegúrate de que es un número
        console.log('Buscando horarios para el día:', nuevoDia); // Verifica qué valor se está buscando
        const diaBuscado = await cabinaModel.find({dia:nuevoDia});
        console.log('Resultados encontrados:', diaBuscado); // Verifica los resultados de la búsqueda
        return diaBuscado.length > 0 ? diaBuscado : undefined;
    }
    agregarHorarioCabina= async (horario) =>{
        const data = {cabina:horario.cabina,hora:horario.hora,dia:horario.dia,estado:horario.estado};
        let result = await cabinaModel.create(data);
        return result;
    }
}