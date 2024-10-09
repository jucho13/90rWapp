import express from "express";
import { __dirname } from "../utils.js";
import bodyParser from 'body-parser'
import wsappRouter from './routes/whatsapp.router.js';



const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/src/public"));

app.use(bodyParser.json());


app.use("/api/whatsapp", wsappRouter);





