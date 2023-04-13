import { Router } from "express";
import AuthManager from "../dao/dbManagers/authManager.js";
import UserManager from "../dao/dbManagers/userManager.js";

const router = Router();
const authManager = new AuthManager();
const userManager = new UserManager();

// RUTAS PARA LOGIN--------------------------------------------------------------------

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);

        if (result.status === "success") {
            req.session.user = result.user;
            res.send({ status: "success", message: "Inicio de sesión exitoso" });
        } else {
            res.status(401).render("login", { error: result.message });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).render("login", { error: "Error interno del servidor" });
    }
});

//RUTAS PARA REGISTRO---------------------------------------------------------------------

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const {first_name, email, password} = req.body;

    try {
        const registered = await createUser(first_name, email, password);
        if (registered.status === "success") {
            res.send({ status: "success", payload: registered });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(result);        
    }
})

//RUTA PARA LOGOUT-----------------------------------------------------------------------

router.post("/logout", (req, res) => {
    authManager.logoutUser(req, res);
})



export default router;