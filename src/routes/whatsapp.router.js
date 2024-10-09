import { Router } from "express";
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { obtenerHorarioString, validatePhoneNumber, validateMoreThanOneHourConnection, generarMensajePedidos, recibirDateDevolverDia,sumarDias } from "../../utils.js";
import {whatsappService, orderService, logisticaService} from "../services/factory.js";
import cabinaJson from '../files/cabina.json' assert { type: 'json' };
import { NoAuth } from "whatsapp-web.js";
const { Client} = pkg;
const router= Router();
let response;


const client = new Client({
    authStrategy: new NoAuth()
})
    
client.on('ready', () => {
    console.log('Client is ready!');
});
    
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
    

client.on('message_create', async message => {
    try {
        // Verifica que el mensaje no sea enviado por el bot
        if (message.id.fromMe === true) {
            console.log("Mensaje del bot, ignorado.");
            return; // Salir si el mensaje fue enviado por el bot
        }
        console.log(message);
        response = parseInt(message.body);
        const numeroVirgen=message._data.from;
        const numeroDestino= await validatePhoneNumber(numeroVirgen);
        
        let mensaje;
        switch (response) {
            case 121212:
                cabinaJson.forEach(async (element) => {
                    await logisticaService.agregarHorarioCabina(element);
                })
                mensaje='Ingreso del mes de cabina';
                sendMessages(mensaje,numeroDestino);
                break;
            case 0:
                await whatsappService.updateSteps(numeroDestino, 0);
                await client.archiveChat(numeroVirgen); 
                break;
            case 1:
                await client.archiveChat(numeroVirgen);
                mensaje = "Donde se encuentra nuestro numero de telefono, puede acceder al catálogo y agregar productos a su pedido.\n Si desea algun producto que no se encuentra en nuestro catálogo o si tiene alguna otra consulta, escriba 3\nSi quiere ver sus pedidos, responda 2\nEn el caso de aun no poder, puede guiarse con este video: https://youtu.be/MPyotKqxvIc?si=yfdYUK6pCDAGYuAH";
                await sendMessages(mensaje,numeroDestino);
                await whatsappService.updateSteps(numeroDestino, 4);
                break;
            case 2:
                await client.archiveChat(numeroVirgen);
                const pedidos= await orderService.getOrdersByCel(numeroDestino);
                if (pedidos){
                    const mensajePedidos=await generarMensajePedidos(pedidos);
                    await sendMessages(mensajePedidos, numeroDestino);
                }
                else{
                    mensaje=`El numero ${numeroDestino} no tiene pedidos realizados en esta plataforma`
                    await sendMessages(mensaje, numeroDestino);
                }
                
                break;
            case 3:
                await client.unarchiveChat(numeroVirgen);
                mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                await sendMessages(mensaje, numeroDestino);
                await whatsappService.updateSteps(numeroDestino, 4);
                break;
            default:
                await client.archiveChat(numeroVirgen);
                const connection=await whatsappService.getLastConnection(numeroDestino); // obtiene la ultima consulta del usuario
                const user = await whatsappService.getByNumber(numeroDestino);
                console.log(user);
                if (message._data.type === 'order') {
                    const orderDetails =await message.getOrder();
                    mensaje='Indica una direccion para la entrega de su pedido (direccion altura) \nEn caso de ser departamento (direccion altura P/D)'
                    if (orderDetails && orderDetails.products) {
                        const products = orderDetails.products;
                        
                        products.forEach(product => {
                            const productId = product.id;
                            const productQuantity = product.quantity;
            
                            console.log(`${product.name}Producto ID: ${productId}, Cantidad: ${productQuantity}`);
                        });
                    } 
                    if(!user){
                        await whatsappService.saveUser(numeroDestino,connection, message.orderId); // crea el nuevo usuario
                        await sendMessages(mensaje, numeroDestino);
                        await whatsappService.updateSteps(numeroDestino, 1);
                        await orderService.saveOrder(numeroDestino, orderDetails.products, message._data.totalAmount1000/1000, message.orderId );   
                    }
                    else
                    {
                        const userRegistrado= await whatsappService.getByNumber(numeroDestino);
                        if(userRegistrado.direccion){
                            mensaje=`Esta es su ultima direccion: ${userRegistrado.direccion}.Envie ''ok'' en caso de querer mantenerla o escriba su nueva direccion`
                            await sendMessages(mensaje, numeroDestino);
                        }
                        await sendMessages(mensaje,numeroDestino);
                        await whatsappService.updateConnection(numeroDestino, connection);
                        await whatsappService.updateOrder(numeroDestino, message.orderId);
                        await whatsappService.updateSteps(numeroDestino, 1); 
                        await orderService.saveOrder(numeroDestino, orderDetails.products, message._data.totalAmount1000/1000,message.orderId );
                    }
                    break;
                }
                else if(message._data.type === 'chat'){
                    if(user){
                        if(user.steps === 1){// respuesta despues de una orden de pedido
                            // Crear un objeto Date con la fecha actual
                           const hoy = new Date();
       
                           // Obtener solo el día del mes (1-31)
                           const diaDeHoy =parseInt(await recibirDateDevolverDia(hoy));
                           console.log(diaDeHoy);
                           
                           const horariosDisponibles = await logisticaService.getHorariosDisponiblesEnUnDia(diaDeHoy);
                           console.log(`HORARIOS DISPONIBLES DEL DIA DE HOY ${diaDeHoy}: ${horariosDisponibles}`);
                           
                           
                           const horariosDisponiblesDeMañana= await logisticaService.getHorariosDisponiblesEnUnDia(diaDeHoy + 1);
                           console.log(`HORARIOS DISPONIBLES DEL DIA DE MAÑANA ${diaDeHoy +1}: ${horariosDisponiblesDeMañana}`);
                           //tomar horarios disponibles para la entrega desde logistica o order sabiendo disponibilidad, respecto del peso que se va a cargar
                           // Crear un mensaje basado en los horarios disponibles
                           mensaje = 'Elija un horario de los siguientes para la entrega del dia:  ';
       
                           mensaje += diaDeHoy 
       
                           if(horariosDisponibles.length > 0){
                               if (horariosDisponibles[0].estado ===0) {
                                   mensaje += '\nIngrese 10       Para seleccionar el horario de 10:00 a 13:00hs\n';
                               }
                               if (horariosDisponibles[1].estado ===0) {
                                   mensaje += '\nIngrese 13       Para seleccionar el horario de 13:00 a 16:00hs\n';
                               }
                               if (horariosDisponibles[2].estado ===0) {
                                   mensaje += '\nIngresa 16       Para seleccionar el horario de 16:00 a 18:00hs\n';
                               }
                               if (horariosDisponibles[3].estado ===0) {
                                   mensaje += '\nIngresa 18       Para seleccionar el horario de 18:00 a 20:00hs\n';
                               }
                           }
       
                           mensaje += '\n Sino puede elegir un horario disponible para mañana. Dia: '
                               
                           mensaje += diaDeHoy + 1
                           if(horariosDisponibles.length > 0){
                               if (horariosDisponiblesDeMañana[0].estado ===0) {
                                   mensaje += '\nIngrese 100       Para seleccionar el horario de 10:00 a 13:00hs\n';
                               }
                               if (horariosDisponiblesDeMañana[1].estado ===0) {
                                   mensaje += '\nIngrese 130       Para seleccionar el horario de 13:00 a 16:00hs\n';
                               }
                               if (horariosDisponiblesDeMañana[2].estado ===0) {
                                    mensaje += '\nIngresa 160      Para seleccionar el horario de 16:00 a 18:00hs\n';
                               }
                               if (horariosDisponiblesDeMañana[3].estado ===0) {
                                   mensaje += '\nIngresa 180       Para seleccionar el horario de 18:00 a 20:00hs\n';
                               }
                           }
                               
                           mensaje += '\nSi ninguna de estos horarios disponibles les parece correcto o no figura ningun horario, por favor ingrese 22...'
       
                           if(message._data.body === 'ok' || message._data.body === 'Ok' || message._data.body === 'OK'|| message._data.body === 'Okk'|| message._data.body === 'oK'|| message._data.body === 'ook'){
                                // entra aca porque el usuario acepta su direccion almacenada en base de datos
                               await whatsappService.updateSteps(numeroDestino, 2);
                               await sendMessages(mensaje, numeroDestino);
                               break;
                           }else{
                               //entra aca porque el usuario decide agregar una nueva direccion
                                const direccionUser= message._data.body;
                                await orderService.updateDireccion(numeroDestino,direccionUser);
                                await whatsappService.updateDireccion(numeroDestino, direccionUser);
                                await whatsappService.updateSteps(numeroDestino, 2);
                                await sendMessages(mensaje, numeroDestino);
                                break;
                           }
                        }
                        else if(user.steps === 2){//aca entraria despues de elegir el horario del envio 
                            const hoy = new Date(Date.now());
                            // Lógica principal
                            let diaDeHoy = await recibirDateDevolverDia(hoy);
                            diaDeHoy = parseInt(diaDeHoy);  // Conviértelo a entero si aún no lo es

                            if (isNaN(diaDeHoy)) {
                                console.error("Error: diaDeHoy no es un número válido");
                                await sendMessages('Hubo un error con la fecha actual, por favor intente nuevamente más tarde.', numeroDestino);
                                return;  // Termina el flujo si el día no es válido
                            }

                            // Procesamiento de la respuesta del usuario
                            const respuestaHorario =parseInt(message._data.body);
 
                            if (isNaN(respuestaHorario)) {
                                console.error("Error: respuestaHorario no es un número válido");
                                await sendMessages('Por favor, envíe una respuesta válida.', numeroDestino);
                                return;  // Termina si la respuesta no es válida
                            }

                            // Verifica los horarios
                            if ([10, 13, 16, 18].includes(respuestaHorario)) {
                                await procesarHorario(numeroDestino,respuestaHorario,diaDeHoy);
                                break;
                            } else if ([100, 130, 160, 180].includes(respuestaHorario)) {
                                await procesarHorario(numeroDestino,respuestaHorario,diaDeHoy);  
                                break;
                            } else if (respuestaHorario === 22) {
                                // Ningún horario fue satisfactorio
                                const mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                                await sendMessages(mensaje, numeroDestino);
                                await whatsappService.updateSteps(numeroDestino, 4);
                                break;
                            } else {
                                // Respuesta incorrecta
                                const mensaje = 'Por favor, envíe una respuesta correcta o ingrese 22 y enseguida le responderemos';
                                await sendMessages(mensaje, numeroDestino);
                                break;
                            }

                           
                           //seguir con el step 3 con las indicaciones de aca abajo
                           //verificar porque desconto del horario de las 10 de la mañana
                               
                               // aca deberia recibir la orden del horario
                               // que deberia pasar despues??
                               // yo creo que despues del horario, deberia recibir un resumen del pedid 
                               // con el importe, la direccion y el horario. Avisando que nos vamos a volver a comunicar a primera hora
                               // para la doble confirmacion del mismo, a modo de recordatorio y seguridad.
                               // cuando quede asentado el pedido quedaria en despachado su estado
                               // y cuando se confirme tres horas antes quedaria ''en curso''
                               // podria avisar cuando sale el repartidor con alguna recepcion de numero
                               // y el pedido quedaria en ''enviando'' o '' en curso ''
                               // y una vez que lo recibe en ''entregado''
                               
                               //seguir en steps 3
                        }
                       else if(user.steps===3){
                           const respuestaUsuario= parseInt(message.body);
                           if(respuestaUsuario===11){
                               await orderService.updateEstado(numeroDestino, 'despachado');
                               mensaje='Muchas gracias por su pedido. Nos volveremos a comunicar antes de la entrega...'
                               await sendMessages(mensaje, numeroDestino);
                           }else{
                               mensaje = 'Respuesta fuera de los limites, si desea aceptar su pedido envie 11 y si quiere hablar con nosotros envie 3'
                               await sendMessages(mensaje, numeroDestino);                               
                           }
                               
                               
                       }
                       else if(user.steps === 4){
                           await client.unarchiveChat(numeroVirgen);
                           break;
                       }
                    }
                    else{
                        if (await validateMoreThanOneHourConnection(connection)){ // Valida que haya pasado mas de una hora de su ultima consulta
                            console.log('paso mas de una hora');
                            
                            const newConnection= Date.now();
                            if(await whatsappService.getByNumber(numeroDestino)=== undefined){
                                console.log('creando usuario');
                                
                                await whatsappService.saveUser(numeroDestino,newConnection); // crea el nuevo usuario
                            }
                            mensaje = 'Bienvenido a 90R! 🥕🥔\n\nGracias por contactarnos! Nos enorgullece ofrecerte los mejores precios en productos frescos en Mar del Plata  🍉🍇\n\n¿Cómo te podemos ayudar? Por favor, elige una de las siguientes opciones:\n\n✅ Compra: Escribe 1 para conocer el proceso de compra\n✅ Pedidos: Escribe 2 para revisar tus pedidos\n✅ Contacto: Escribe 3 para hablar con nosotros';
                            await sendMessages(mensaje, numeroDestino);
                            await whatsappService.updateSteps(numeroDestino, 4);
                            break;
                            
                        }else{ // si paso menos de una hora de su ultima consulta
                             // Si el numero esta archivado significa que no tuvo relevancia para hablar con el cliente, por lo tanto, se lo desarchiva, se manda el mensaje de bot y queda desarchivado para poder hablar normalmente por una hora
                                console.log('esta archivado, se desarchiva');
                                await client.unarchiveChat(numeroVirgen);
                                mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                                await whatsappService.updateSteps(numeroDestino, 4);
                                await sendMessages(mensaje, numeroDestino);
                                break;
                            }
                    }
                }
                else{
                     // Si el numero esta archivado significa que no tuvo relevancia para hablar con el cliente, por lo tanto, se lo desarchiva, se manda el mensaje de bot y queda desarchivado para poder hablar normalmente por una hora
                        console.log('No es un mensaje tipo chat ni order');
                        await client.unarchiveChat(numeroVirgen);
                        mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                        await whatsappService.updateSteps(numeroDestino, 4);
                        await sendMessages(mensaje, numeroDestino);
                        break;
                }
                
                       
        }
    }catch (error) {
        console.log(error);
    }
});

router.post('/send', async (req, res) => {
    const { numeroDestino, mensaje } = req.body;
    if (!numeroDestino || !mensaje) {
        return res.status(400).json({ error: 'Número de destino y mensaje son requeridos' });
    }
    
    try {
        const chatId = `${numeroDestino}@c.us`;
        const response = await client.sendMessage(chatId, mensaje);
        res.json({ message: 'Mensaje enviado', response });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
});

async function sendMessages(mensaje,numeroDestino){
    try {
        const response = await fetch('http://localhost:8081/api/whatsapp/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({ numeroDestino, mensaje })
         });
    
        if (response.ok) {
            return 'Mensaje informativo enviado.';  // Puedes devolver el mensaje o lo que prefieras
        } else {
            const errorMessage = await response.text(); // Captura el cuerpo de la respuesta en caso de error
            console.error(`Error al enviar el mensaje: ${errorMessage}`);
            return `Error al enviar el mensaje: ${errorMessage}`;
        }

    } catch (error) {
        console.error('Error en el fetch:', error);
        return `Error en el fetch: ${error.message}`;
    }
}

async function procesarHorario(numeroDestinoc,respuesta,diaDeHoy) {
    numeroDestinoc=parseInt(numeroDestinoc);
    diaDeHoy=parseInt(diaDeHoy);
    const order = await orderService.getOrdersByCel(numeroDestinoc);
    console.log(order);
    const products=order.productos;
    console.log(`ESTOS SON LOS PRODUCTS ${products[0]}`);
    
    let peso=0,dia;
    respuesta=parseInt(respuesta);

    for (let i = 0; i < products.length; i++) {
        peso+=products[i].quantity * 15;    
    }
    console.log(`EL PESO DE LOS PRODUCTOS ES DE ${peso}`);
    
    if (respuesta===100 || respuesta===130||respuesta===160 || respuesta===180){
        console.log(`Reserva peso en cabina en el dia de mañana a la hora:${respuesta/10}`);
        dia=diaDeHoy+1;
        await orderService.updateDiaHorario(numeroDestinoc, respuesta/10, dia);
        await logisticaService.reservarPesoEnCabina(dia, peso, respuesta/10);
    }
    else if(respuesta===10|| respuesta===13 || respuesta===16 || respuesta===18){
        console.log(`Reserva peso en cabina en el dia de hoy a la hora:${respuesta}`);
        await orderService.updateDiaHorario(numeroDestinoc, respuesta, diaDeHoy);
        await logisticaService.reservarPesoEnCabina(diaDeHoy, peso, respuesta);
        dia=diaDeHoy;
    }
    else{
        mensaje = 'Envie una respuesta horaria correcta'
    }
    const orderNueva= await orderService.getOrdersByCel(numeroDestinoc);
    const horario = orderNueva.horario;
    const horarioString = await obtenerHorarioString(horario);
    // Mostrar el pedido completo
    let mensaje = `Pedido: ${order.orderID}
Dirección: ${order.direccion}
Total: ${order.importe}
Horario de Entrega: ${horarioString}
Día: ${dia}
¿Está de acuerdo? Envíe un 11 para confirmar`;
                   
    await sendMessages(mensaje, numeroDestinoc);
    await whatsappService.updateSteps(numeroDestinoc, 3);
}

client.initialize();




export default router;