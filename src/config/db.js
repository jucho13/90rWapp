import mongoose from "mongoose";

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
            await mongoose.connect("mongodb+srv://juliansolaririveiro:lalala00@cluster0.wwxziry.mongodb.net/?retryWrites=true&w=majority");
            // await mongoose.connect(process.env.MONGO_URL)
            console.log("Conectado con exito a MongoDB usando Moongose.");
        } catch (error){
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();   
        }
    }
}