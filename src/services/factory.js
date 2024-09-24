import MongoSingleton from '../config/db.js'

let chatService;
let productService;
let orderService;
let ticketService;
let userService;
let whatsappService;


async function initializeMongoService() {
    console.log("Iniciando servicio para MongoDB");
    try {
        // conectamos Mongo
        await MongoSingleton.getIntance()

    
        const { default: ticketServiceMongo } = await import('./DAO/db/ticket.service.js');
        ticketService= new ticketServiceMongo();
        console.log("Servicio de tickets cargado:");
        console.log(ticketService);

        const { default: orderServiceMongo } = await import('./DAO/db/order.service.js');
        orderService= new orderServiceMongo();
        console.log("Servicio de orders cargado:");
        console.log(orderService);

        
 
        const { default: whatsappServiceMongo } = await import('./DAO/db/whatsapp.service.js');
        whatsappService= new whatsappServiceMongo();
        console.log("Servicio de whatsapp cargado:");
        console.log(whatsappService);
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}

initializeMongoService();


export { productService, orderService, ticketService, chatService, userService, whatsappService }