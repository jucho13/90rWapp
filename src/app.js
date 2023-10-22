import express from "express";
import productRouter from "../src/routes/products.router.js";
import cartRouter from "../src/routes/carts.router.js";
import { __dirname } from "../utils.js";
import viewRouter from "../src/routes/views.router.js";
import RTPRouter from "../src/routes/realtimeproducts.router.js";
import sessionsRouter from '../src/routes/sessions.router.js'
import gitHubRouter from '../src/routes/gitHub.router.js'
import ticketRouter from './routes/ticket.router.js'
import chatRouter from './routes/chat.router.js'
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import passport from 'passport';
import initializePassport from '../src/config/passport.config.js';
import productService from '../src/services/DAO/db/product.service.js'
// dependencias para las sessions
import session from 'express-session';
import MongoStore from 'connect-mongo';
//import managers
import { chatService } from "./services/factory.js";
import dotenv from 'dotenv'; 
import envConfig from "../src/config/env.config.js";



const app=express();
// dotenv.config();
// console.log(envConfig.port);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+ "/src/public"));
//config HANDLEBARS

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/src/views');
app.set('view engine', 'handlebars');

// // seteo direccion mongo
// const MONGO_URL= 'mongodb://127.0.0.1:27017/Ecommerce?retryWrites=true&w=majority';


//SESSIONS 
app.use(session({
  //ttl: Time to live in seconds,
  //retries: Reintentos para que el servidor lea el archivo del storage.
  //path: Ruta a donde se buscará el archivo del session store.

  // Usando --> session-file-store
  // store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),


  // Usando --> connect-mongo
  store: MongoStore.create({
      mongoUrl: envConfig.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60
  }),


  secret: "coderS3cr3t",
  resave: true, //guarda en memoria
  saveUninitialized: true, //lo guarda a penas se crea
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//rutas
app.use("/",productRouter);
app.use("/",cartRouter);
app.use('/', viewRouter);
app.use('/',RTPRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/github", gitHubRouter);
app.use("/ticket", ticketRouter);
app.use("/messages", chatRouter);

const httpServer = app.listen(envConfig.port, () => {console.log(`Server is running on port ${envConfig.port}`)});

export const socketServer = new Server(httpServer);

// abrimos el canal de comunicacion
const pService=new productService();

socketServer.on('connection',async (socket) => {
  console.log('Nuevo cliente conectado');
  const productLista=await pService.getAllL();
  // let productos=JSON.stringify(productLista);
  socket.emit('all-products', productLista); 
  socket.on('addProduct', async data => {
    console.log(`lo que regresa de add product es ${data.title}${data.description}${data.price}${data.thumbnail}${data.code}${data.stock}${data.status}${data.id}`);
    const prodCreado=await pService.save(data.title,data.description,data.price,data.thumbnail,data.code,data.stock,data.status,data.id=0);
    const updatedProducts = await pService.getAllL(); // Obtener la lista actualizada de productos
    socket.emit('productosupdated', updatedProducts);
  });
  socket.on("deleteProduct", async (id) => {
    console.log("ID del producto a eliminar:", id);
    const op=  await pmanager.delete(id);
    console.log(`Operacion ${op}`);
    const updatedProducts = await pmanager.getAllL();
    socketServer.emit("productosupdated", updatedProducts);
  });
  socket.on('new-message', async () => {
    const messages = await chatService.getMessages();
    socket.emit('messages', messages);
  });
  
  socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
  });
});

