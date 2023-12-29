import { Server } from "socket.io";
import {cartService, productService, userService} from "../services/factory.js";
import userModel from "../services/DAO/db/models/userModel.js";
import jwt  from "jsonwebtoken";
import UserDTO from "../services/DTO/user.dto.js";
import { isValidPassword, createHash } from "../../utils.js";
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
export const registerPost = async (req, res) => {
    const { first_name, last_name, email, age, status, password } = req.body;
    const newCart = await cartService.save({});
    let connection= Date.now();    
    try {
        const exists = await userModel.findOne({ email });

        if (exists) {
            console.log("El usuario ya existe.");
            res.status(400).send("El usuario ya existe."); // Enviar un código de estado 400 (Bad Request) si el usuario ya existe
            return;
        }

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            loggedBy: "App",
            status,
            lastConnection: connection
        };

        const result = await userService.save(user);
        res.status(201).send("Usuario registrado exitosamente"); // Enviar un código de estado 201 (Created) y un mensaje
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor"); // Enviar un código de estado 500 (Internal Server Error) en caso de error interno
    }
};


export const loginPost = async (req,res) =>{
    const user = req.body;
    console.log(user);
    if (!user){
        res.status(401).send({ status: "error", error: "credenciales incorrectas" });
    } 
    const userp = await userModel.findOne({ email: user.email });
    console.log(userp);
    if (!userp){
        res.status(401).send({ status: "error", error: "credenciales incorrectas" });
    }
    else{
        req.session.user = {
            name: `${userp.first_name} ${userp.last_name}`,
            email: userp.email,
            age: userp.age,
            cart: userp.cart._id
        }
        // console.log("Usuario encontrado para login:");
        let connection= Date.now();    
        const updateTimeStamp = await userModel.updateOne({ _id: userp._id }, { $set: { lastConnection: connection } });
        if (!isValidPassword(userp, user.password))
        {
            res.status(400).send({status: 'error', message: 'contraseña invalida'})
        }
        const userDto = UserDTO.getUserTokenFrom(userp);
        console.log(userDto);
        const token = jwt.sign(userDto,/*process.env.JWT_TOKEN*/'tokenSecretJWT',{expiresIn:"1h"});
        res.cookie('jwt', token, { maxAge: 3600000 });
        res.status(200).json({ message: "Inicio de sesión exitoso", user });
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
    const cookie = req.cookies['jwt'];
    const decoded = jwt.verify(cookie, /*process.env.JWT_TOKEN*/'tokenSecretJWT');
    console.log(decoded);
    const cartID= decoded.cart;
    console.log(cartID);
    res.cookie('cart', cartID, {maxage: 3000000});
    res.render('index', {user:req.session.user});
}
    catch(error){
        res.send(error);
    }
}


export const verUsers = async (req,res) => {
    const users = await userService.getAll();
    console.log(users);
    let usersDTO=[];
    users.forEach(user => {
        const userdto= UserDTO.getUserTokenFrom(user);
        usersDTO.push(userdto);
    });
    res.render('verUsers',{ user: usersDTO });
}
export const deleteTimedOutUsers = async (req, res) => {
    const timeout = 86400 * 1;//cambiar a dos, por los dos dias
    const users = await userService.getAll();
    const now = new Date();
    const nowInSeconds = now.getTime() / 1000;
    let deletedUsers = 0;
    for (const user in users) {
        const userDate = new Date(users[user].lastConnection);
        const userDateInSeconds = userDate.getTime() / 1000;
        const diff = nowInSeconds - userDateInSeconds;
        if (diff >= timeout) {
            await userService.delete(users[user]._id);
            deletedUsers++;
            const emailBody = {
                to: users[user].email,
                subject: "Cuenta eliminada",                
                html: "<h1>Hola " + users[user].first_name + "</h1><br/><h2>Tu cuenta ha sido eliminada por inactividad</h2><br/><p>Si lo deseas, puedes volver a registrarse en cualquier momento</p>"
            }
            try {
                fetch("http://localhost:8080/mail/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(emailBody)
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    res.status(200).send('{"status": "ok", "message": "User cleanup executed", "deletedUsers": ' + deletedUsers + '}');
}

export const logOut = (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
}

export const vistaUnicaAdminUsers = async (req,res)=>{
    const users = await userService.getAll();
    let usersDTO=[];
    users.forEach(user => {
        const userdto= UserDTO.getUserTokenFrom(user);
        usersDTO.push(userdto);
    });
    res.render('vistaAdminUsers', {user: usersDTO});
}