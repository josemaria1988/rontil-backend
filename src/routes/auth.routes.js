import { Router } from "express";
import AuthManager from "../dao/dbManagers/authManager.js";
import passport from "passport";

const router = Router();
const authManager = new AuthManager();

// RUTAS PARA LOGIN--------------------------------------------------------------------

router.get("/login", (req, res) => {
    res.render("login", {style: "styles.css", title: "Login"});
});

router.post("/login", passport.authenticate("login", {failureRedirect: "/failLogin"}),
    async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        };
        return res.send({status: "success", payload: req.user});
});

router.get("/failLogin", (req, res) => {
    return res.send({status: "status", message: "Error de autenticación"})
})

//RUTAS PARA REGISTRO---------------------------------------------------------------------

router.get("/register", (req, res) => {
    res.render("register", {style: "styles.css", title: "Register"});
});

router.post("/register", passport.authenticate("register", {failureRedirect: "/failRegister"}) ,async (req, res) => {
    return res.send({status: "success", message: "user registered"});
});

router.get("/failRegister", (req, res) => {
    return res.send({status: "status", error: "Error de autenticación"})
})

//RUTA PARA LOGOUT-----------------------------------------------------------------------

router.post("/logout", (req, res) => {
    authManager.logoutUser(req, res);
})



export default router;