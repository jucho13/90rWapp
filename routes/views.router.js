import {Router} from 'express';
import userModel from '../models/userModel.js';
import passport from 'passport';
const router = Router();


router.get('/',(req,res)=>{
    res.render('index',{})
});

//Session management:
router.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!");
    }
});

//Login
router.get('/login', (req, res) => {
    res.render('login');
});
router.post("/register", passport.authenticate('register', { failureRedirect: '/fail-register' }), async (req, res) => {
    console.log("Registrando nuevo usuario.");
    res.redirect("/login");    
})

router.post("/login", passport.authenticate("login", { failureRedirect: '/fail-login' }), async (req, res) => {
    console.log("User found to login:");
    const user = req.user;
    console.log(user);

    if (!user) return res.status(401).send({ status: "error", error: "credenciales incorrectas" });
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.redirect("/profile");
});



router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

router.get('/register', (req, res) => {
    res.render('register');
});
//profile

router.get('/profile', (req, res) => {
    res.render('profile');
});

//private

function auth(req, res, next) {
    if (req.session.user.email === 'adminCoder@coder.com' && req.session.user.admin) {
        return next();
    } else {
        return res.status(403).send('Usuario no autorizado para ingresar a este recurso..')
    }
}

router.get('/private', auth, (req, res) => {
    res.render('private');
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
});



export default router;