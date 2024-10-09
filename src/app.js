import express from "express";
import { __dirname } from "../utils.js";
import bodyParser from 'body-parser'
import wsappRouter from './routes/whatsapp.router.js';
import MongoSingleton from "./config/db.js";


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/src/public"));

app.use(bodyParser.json());


app.use("/api/whatsapp", wsappRouter);

const startServer = async () => {
    try {
        await MongoSingleton.getIntance(); // Asegúrate de que la conexión esté establecida
        console.log("Conexión a MongoDB inicializada.");

    } catch (error) {
        console.error("Error al inicializar la conexión a MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
};

// Iniciar el servidor
startServer();

const httpServer = app.listen(process.env.PORT || 8081 );

