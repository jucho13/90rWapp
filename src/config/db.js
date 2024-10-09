import mongoose from "mongoose";
import{MongoStore} from "wwebjs-mongo";
import pkg from "whatsapp-web.js";
const { RemoteAuth, Client } = pkg;


export default class MongoSingleton {
    static #instance;
    #client; // Agregar una propiedad para almacenar el cliente

    constructor() {
        this.#connectMongoDB();
    } 

    static getIntance() {
        if (this.#instance) {
            console.log("La conexión a la base de datos ya existe");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {  
        try {
            await mongoose.connect(process.env.MONGO_URL);
            const store = new MongoStore({ mongoose: mongoose });
            this.#client = new Client({
                authStrategy: new RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000
                })
            });

            console.log("Conectado con éxito a MongoDB usando Mongoose y cliente de WhatsApp inicializado.");
        } catch (error) {
            console.error("No se pudo conectar a la BD usando Mongoose: " + error);
            process.exit(1);   
        }
    }

    async getClient ()  {
        this.#client.initialize();
        return this.#client; // Método para obtener el cliente
    }
}