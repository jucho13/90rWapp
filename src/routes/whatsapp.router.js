import { Router } from "express";
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { validatePhoneNumber, validateOneDayConnection } from "../../utils.js";
import {whatsappService} from "../services/factory.js";

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
                numeroDestino = // El número de destino es el que te envió el mensaje
                console.log(numeroDestino);
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(message._data.from);
                }
                mensaje = "Donde se encuentra nuestro numero de telefono, puede acceder al catalogo y agregar productos a su pedido.\n\nEn el caso de aun no poder puede guiarse con este video: https://youtu.be/MPyotKqxvIc?si=yfdYUK6pCDAGYuAH";
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
            case 2:
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(message._data.from);
                }
                console.log("Respuesta Negativa");
                break;
            case 3:
                if (numeroVirgen.isArchived)
                {
                    await client.unarchiveChat(message._data.from);
                }    
                mensaje = 'Por favor, deje su consulta y enseguida le responderemos';
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
            default:
                if (!numeroVirgen.isArchived)
                {
                    await client.archiveChat(message._data.from);
                }
                const connection=await whatsappService.getLastConnection(numeroDestino);
                if (await validateOneDayConnection(connection)){
                    await whatsappService.updateConnection(numeroDestino,connection);
                    mensaje = 'Bienvenido a 90R! 🥕🥔\n\nGracias por contactarnos! Nos enorgullece ofrecerte los mejores precios en productos frescos  🍉🍇\n\n¿Cómo te podemos ayudar? Por favor, elige una de las siguientes opciones:\n\n✅ Compra: Escribe 1 para conocer el proceso de compra\n✅ Pedidos: Escribe 2 para revisar tus pedidos\n✅ Contacto: Escribe 3 para hablar con nosotros';
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
                  
                }else{
                    if (await whatsappService.getByNumber(numeroDestino)){
                        return;
                    }
                    else {
                        
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

client.initialize();




export default router;