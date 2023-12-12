import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../services/DAO/db/models/userModel.js';
import { createHash, isValidPassword } from '../../utils.js';
import cartService from '../services/DAO/db/cart.service.js';

const CartService= new cartService();
//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;
const initializePassport = () => {
    /**
      *  Inicializando la estrategia para github.
      *  Done será nuestro callback
     */
    /*=============================================
    =                GitHubStrategy               =
   =============================================*/
    // TODO: Estrategia de Login con GitHub
    passport.use('github', new GitHubStrategy(
        {
            clientID: process.env.gitHubClientId,
            clientSecret: process.env.gitHubClientSecret,
            callbackUrl: process.env.gitHubCallbackUrl
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log("Profile obtenido del usuario: ");
            // console.log(profile);

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                // console.log("Usuario encontrado p.ara login:");
                // console.log(user);
                const newCarts= await CartService.save();
                if (!user) {
                    // console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        cart: newCarts._id,    
                        loggedBy: "GitHub"
                    }
                    const result = await userModel.create(newUser)
                    done(null, result)
                }
                else {
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }))



    /*=============================================
    =                localStrategy                =
    =============================================*/
    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            const newCart= await CartService.save();
            console.log(newCart);
            try {
                const exists = await userModel.findOne({ email });
                if (exists) {
                    // console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                    loggedBy: "App"
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
                console.log(user);
                if (!user) {
                    // console.warn("User doesn't exists with username: " + username);
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