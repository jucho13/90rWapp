import {dirname} from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const __dirname=dirname(fileURLToPath(import.meta.url));
//Crypto functions
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}
export const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Adoptme",
            description: "Documentacion para uso de swagger"
        }
    },
    apis: [`./src/docs/**/*.yaml`]
};
// JWT TOKEN
export  async function authUser(req, res, next) {
    try {
        const token= req.cookies['jwt'];
        const validPayload= await jwt.verify(token,/*process.env.JWT_TOKEN*/'tokenSecretJWT');
        if(validPayload){
            next();
        }
    } catch (error) {
        res.status(401).json({ok:false, message: 'invalid token, please login'});
    }
}
//private
export async function authAdmin(req, res, next) {
    if (req.session.user.email === 'adminCoder@coder.com') {
        return next();
    } else {
        return res.status(403).send('Usuario no autorizado para ingresar a este recurso..')
    }
}