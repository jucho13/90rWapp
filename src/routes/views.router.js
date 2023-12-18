import {Router} from 'express';
import passport from 'passport';
import { sessionManagement, vistaNormal, privateMood, failRegister, failLogin, register, profile, logOut, login} from '../controllers/user.controller.js';
import { Server } from "socket.io";
import UserDTO from '../services/DTO/user.dto.js';
import  jwt  from 'jsonwebtoken';
const router = Router();
const socket= new Server();


router.get('/',authUser, vistaNormal);
//Session management:
router.get("/session", sessionManagement);
//Login
router.get('/login', login);
router.post("/register", passport.authenticate('register', { failureRedirect: '/fail-register' }), async (req, res) => {
    // console.log("Registrando nuevo usuario.");
    res.redirect("/login");    
})

router.post("/login", passport.authenticate("login", { failureRedirect: '/fail-login' }), async (req, res) => {
    // console.log("User found to login:");
    const user = req.user;
    // console.log(user);
    if (!user) return res.status(401).send({ status: "error", error: "credenciales incorrectas" });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        cart: user.cart
    }
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto,/*process.env.JWT_TOKEN*/'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('jwt', token, { maxAge: 3600000 });
    res.redirect("/profile");
});
router.get("/fail-register",failRegister);
router.get("/fail-login",failLogin );
router.get('/register', register);
router.get('/profile',authUser, profile);
// JWT TOKEN
async function authUser(req, res, next) {
    try {
        const token= req.cookies.jwt;
        const validPayload= jwt.verify(token,/*process.env.JWT_TOKEN*/'tokenSecretJWT');    
        next();
    } catch (error) {
        res.status(401).json({ok:false, message: 'invalid token, please login'});
    }
}
//private
function authAdmin(req, res, next) {
    if (req.session.user.email === 'adminCoder@coder.com' && req.session.user.admin) {
        return next();
    } else {
        return res.status(403).send('Usuario no autorizado para ingresar a este recurso..')
    }
}
router.get('/private', authAdmin, privateMood);
router.get("/logout", logOut);

export default router;