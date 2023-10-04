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

export const profile = (req, res) => {
    res.render('profile');
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