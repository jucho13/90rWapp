import MongoSingleton from '../config/db.js'

let chatService;
let productService;
let cartService;
let ticketService;
let userService;

async function initializeMongoService() {
    console.log("Iniciando servicio para MongoDB");
    try {
        // conectamos Mongo
        await MongoSingleton.getIntance()

        // Creamos las instancias de las Clases de DAO de Mongo
        const { default: ProductServiceMongo } = await import('./DAO/db/product.service.js');
        productService = new ProductServiceMongo();
        console.log("Servicio de products cargado:");
        console.log(productService);

        const { default: cartServiceMongo } = await import('./DAO/db/cart.service.js');
        cartService = new cartServiceMongo();
        console.log("Servicio de carts cargado:");
        console.log(cartService);

        const { default: ticketServiceMongo } = await import('./DAO/db/ticket.service.js');
        ticketService= new ticketServiceMongo();
        console.log("Servicio de tickets cargado:");
        console.log(ticketService);

        const { default: chatServiceMongo } = await import('./DAO/db/chat.service.js');
        chatService= new chatServiceMongo();
        console.log("Servicio de chat cargado:");
        console.log(chatService);

        const { default: userServiceMongo } = await import('./DAO/db/user.service.js');
        userService= new userServiceMongo();
        console.log("Servicio de users cargado:");
        console.log(userService);
    
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}

initializeMongoService();


export { productService, cartService, ticketService, chatService, userService }