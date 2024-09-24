import { Router } from "express";
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { validatePhoneNumber, validateMoreThanOneHourConnection } from "../../utils.js";
import {whatsappService, orderService} from "../services/factory.js";

const { Client, LocalAuth} = pkg;
const router= Router();
let response;


const client = new Client({
    authStrategy: new LocalAuth()
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
            case 1:
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(numeroVirgen);
                }
                mensaje = "Donde se encuentra nuestro numero de telefono, puede acceder al catalogo y agregar productos a su pedido.\n\nEn el caso de aun no poder puede guiarse con este video: https://youtu.be/MPyotKqxvIc?si=yfdYUK6pCDAGYuAH";
                await sendMessages(mensaje,numeroDestino);
            case 2:
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(numeroVirgen);
                }
                console.log("Respuesta Negativa");
                break;
            case 3:
                if (numeroVirgen.isArchived)
                {
                    await client.unarchiveChat(numeroVirgen);
                }    
                mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                await sendMessages(mensaje, numeroDestino);
            default:
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(numeroVirgen);
                }
                const connection=await whatsappService.getLastConnection(numeroDestino); // obtiene la ultima consulta del usuario
                const user = await whatsappService.getByNumber(numeroDestino);
                console.log(user);
                
                if(user){// respuesta despues de una orden de pedido en casa de que el usuario no tenga direccion
                    if(user.steps === 1){
                        const direccionUser= message._data.body;
                        await whatsappService.updateDireccion(numeroDestino, direccionUser);
                        //tomar horarios disponibles para la entrega
                        mensaje= `Elija un horario de los siguientes para la entrega:`
                        await whatsappService.updateSteps(numeroDestino, 2);
                        await sendMessages(mensaje, numeroDestino);
                        break;
                    }
                    else if(user.steps === 2){//aca entraria para elegir el horario del envio
                        if(response === 10){// entre las 10 y las 15 

                        }
                        else if (response === 15){ // entre las 15 y las 20

                        }
                        else{// este seria un horario especial premium abonando un diferencial
                    }
                    }
                }
                console.log(`Resultado de getLastConnection ${connection}`);
                if (message._data.type === 'order') {
                    if(!user){
                        const newConnection= Date.now();
                        await whatsappService.saveUser(numeroDestino,newConnection, message.orderId); // crea el nuevo usuario
                            
                    }
                    else
                    {
                        await orderService.updateOrder(numeroDestino, message.orderId);
                    }
                    const orderDetails =await message.getOrder(); 
                    if (orderDetails && orderDetails.products) {
                        const products = orderDetails.products;
                        
                        products.forEach(product => {
                            const productId = product.id;
                            const productQuantity = product.quantity;
            
                            console.log(`Producto ID: ${productId}, Cantidad: ${productQuantity}`);
                        });
                    }
                    mensaje='Indica una direccion para la entrega de su pedido'
                    await sendMessages(mensaje, numeroDestino);
                    await whatsappService.updateSteps(numeroDestino, 1);
                    await whatsappService.updateOrder(numeroDestino, message.orderId);//REVISAR ESTE Y EL DE ABAJO
                    // await orderService.createOrder(numeroDestino, products, )
                    break;
                }
                else if(message._data.type === 'chat'){
                    console.log('hola');
                    
                    if (await validateMoreThanOneHourConnection(connection)){ // Valida que haya pasado mas de una hora de su ultima consulta
                        console.log('paso mas de una hora');
                        
                        const newConnection= Date.now();
                        if(await whatsappService.getByNumber(numeroDestino)=== undefined){
                            console.log('creando usuario');
                            
                            await whatsappService.saveUser(numeroDestino,newConnection); // crea el nuevo usuario
                        }
                        mensaje = 'Bienvenido a 90R! 🥕🥔\n\nGracias por contactarnos! Nos enorgullece ofrecerte los mejores precios en productos frescos en Mar del Plata  🍉🍇\n\n¿Cómo te podemos ayudar? Por favor, elige una de las siguientes opciones:\n\n✅ Compra: Escribe 1 para conocer el proceso de compra\n✅ Pedidos: Escribe 2 para revisar tus pedidos\n✅ Contacto: Escribe 3 para hablar con nosotros';
                        await sendMessages(mensaje, numeroDestino);
                        break;
                        
                    }else{ // si paso menos de una hora de su ultima consulta
                        if (numeroVirgen.isArchived) // Si el numero esta archivado significa que no tuvo relevancia para hablar con el cliente, por lo tanto, se lo desarchiva, se manda el mensaje de bot y queda desarchivado para poder hablar normalmente por una hora
                        {
                            console.log('esta archivado, se desarchiva');
                            
                            await client.unarchiveChat(numeroVirgen);
                            mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                            await sendMessages(mensaje, numeroDestino);
                            break;
                        }
                        else{
                            await client.unarchiveChat(numeroVirgen);
                            mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                            await sendMessages(mensaje, numeroDestino);
                            break;
                        }
                        
                    }
                }
                else{
                    if (numeroVirgen.isArchived) // Si el numero esta archivado significa que no tuvo relevancia para hablar con el cliente, por lo tanto, se lo desarchiva, se manda el mensaje de bot y queda desarchivado para poder hablar normalmente por una hora
                    {
                        console.log('No es un mensaje tipo chat ni order');
                        await client.unarchiveChat(numeroVirgen);
                        mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                        await sendMessages(mensaje, numeroDestino);
                        break;
                    }
                    else{
                        mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
                        await sendMessages(mensaje, numeroDestino);
                        break;
                    }
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

client.initialize();




export default router;