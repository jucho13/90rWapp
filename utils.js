import {dirname} from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';

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