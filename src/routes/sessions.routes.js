import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import CartManager from "../dao/dbManagers/cartManager.js"
import passport from "passport";

const router = Router();
const cartManager = new CartManager();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failRegister" }),
  async (req, res, next) => {
    try {
      // Crear carrito vacío para el usuario
      await cartManager.createEmptyCart(req.user._id);

      // Continuar al siguiente middleware o enviar respuesta
      next();
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },
  async (req, res) => {
    return res.send({ status: "success", message: "user registered" });
  }
);

router.get("/failRegister", (req, res) => {
  console.log("Failed Register");
  return res.send({ status: "error", error: "authentication error" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failLogin" }),
  async (req, res) => {
    if (!req.user)
      return res.status(401).send({ status: "error", error: "Unauthorized" });

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    res.send({ status: "success", payload: req.user });
  }
);

router.get("/failLogin", (req, res) => {
  res.send({ status: "error", error: "failed login" });
});

router.put("/restore", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "user does not exist" });
    }

    const hashedPassword = createHash(password);

    await userModel.updateOne({ email }, { password: hashedPassword });

    return res.send({
      status: "sucess",
      message: "succesfully updated password",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


//LOGIN CON GITHUB
router.get('/github', passport.authenticate('githublogin', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('githublogin', {failureRedirect: '/login'}), async (req, res) => {
  req.session.user = req.user;
  res.redirect('/login')
})

export default router;