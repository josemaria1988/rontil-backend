

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send({status: "error", message: "No estás autorizado entrar acá"})
    }
};

export default isAuthenticated;