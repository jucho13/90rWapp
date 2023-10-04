import dotenv from 'dotenv';
import program from '../src/process.js';

const enviroment = program.opts().mode;
console.log("Modo Opt: ", program.opts().mode);

dotenv.config({
    path: enviroment === "dev" ? "./config/.env.development" : "./config/.env.production"
});



export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHubCallbackUrl: process.env.GITHUB_CALLBACK_URL
};