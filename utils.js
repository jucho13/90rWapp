import {dirname} from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { stringify } from "querystring";

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

export async function validatePhoneNumber(numero) {
    const cleanedNumber = numero.split('@')[0];

    // Regex que valida que el número contenga solo dígitos
    const phoneRegex = /^\d+$/;
    const check=phoneRegex.test(cleanedNumber)
    if (check === true)
    {
        return  cleanedNumber;
    }

}
export async function validateOneDayConnection(date) {
    const dateNow = Date.now();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    // Calcula la diferencia entre la fecha actual y la fecha pasada como parámetro
    const difference = dateNow - new Date(date).getTime();
    console.log(difference);
    
    // Verifica si ha pasado un día
    if (difference >= oneDayInMilliseconds) {
        return true; // Ha pasado más de un día
    } else {
        return false; // No ha pasado un día
    }
}
