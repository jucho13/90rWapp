import express from "express";
import { __dirname } from "../utils.js";
import bodyParser from 'body-parser'
import wsappRouter from './routes/whatsapp.router.js';

//import managers
import { chatService, productService } from "./services/factory.js";


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/src/public"));

app.use(bodyParser.json());


app.use("/api/whatsapp", wsappRouter);

const httpServer = app.listen(process.env.PORT || 8081, () => {console.log(`Server is running on port 8081`)});

