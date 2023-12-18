import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../services/DAO/db/models/userModel.js';
import { createHash, isValidPassword } from '../../utils.js';
import {cartModel} from '../services/DAO/db/models/cartModel.js';


//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;
const initializePassport = () => {
    /**
      *  Inicializando la estrategia para github.
      *  Done será nuestro callback
     */


    /*=============================================
    =                localStrategy                =
    =============================================*/
    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age, classUser } = req.body;
            const newCart= await cartModel.create({});
            try {
                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                    loggedBy: "App",
                    userStatus: classUser,
                    lastConnection: null
                };
                const result = await userModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    //Estrategia de Login de la app:
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                // console.log("Usuario encontrado para login:");
                let connection= Date.now();    
                const updateTimeStamp = await userModel.updateOne({ _id: user._id }, { $set: { lastConnection: connection } });
                if (!user) {
                    // console.warn("User doesn't5 exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    // console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );


    /*=============================================
    = Funciones de Serializacion y Desserializacion =
    =============================================*/
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

export default initializePassport;