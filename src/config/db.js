import mongoose from "mongoose";
import dotenv from "dotenv";
import envConfig from "./env.config.js";
dotenv.config();

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
} 

    static getIntance() {
        if (this.#instance) {
            console.log("La conexión a la base de datos ya existe");
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {  
        try {
            await mongoose.connect(envConfig.mongoUrl)
            console.log("Conectado con exito a MongoDB usando Moongose.");
        } catch (error){
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();   
        }
    }
}