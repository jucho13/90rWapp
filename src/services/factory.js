import config from "../config/env.config.js";
import MongoSingleton from '../config/db.js'

let productService
let cartService
let ticketService;
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
    
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}


switch (config.persistence) {
    case 'mongodb':
        initializeMongoService();
        break;

    case 'files':
        const { default: ProductServiceFileSystem } = await import("./DAO/filesystem/product.service.js")
        productService = new ProductServiceFileSystem();
        console.log("Servicio de products cargado:");
        console.log(productService);

        const { default: CartServiceFileSystem } = await import('./DAO/filesystem/cart.service.js');
        cartService = new CartServiceFileSystem();
        console.log("Servicio de carts cargado:");
        console.log(cartService);
        break;
    default:
        console.error("Persistencia no válida en la configuración:", config.persistence);
        process.exit(1); // Salir con código de error
}


export { productService, cartService, ticketService }