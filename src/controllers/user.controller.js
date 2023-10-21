import { Server } from "socket.io";
import {productService} from "../services/factory.js";
const socket= new Server();

export const vistaNormal = (req,res)=>{
    res.render('index',{})
};

export const sessionManagement = (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!");
    }
}

export const login = (req, res) => {
    res.render('login');
}

export const failRegister =  (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
}

export const failLogin = (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
}

export const register = (req, res) => {
    res.render('register');
}

export const profile = async (req, res) => {
    try{
    const cartID= req.session.user.cart;
    const products= await productService.getAllL();
    res.cookie('cart', cartID, {maxage: 3000000});
    res.render('index', {user:req.session.user});
}
    catch(error){
        res.send(error);
    }
}

//private

export const privateMood = (req, res) => {
    res.render('private');
};

export const logOut = (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
}