import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import UserManager from "../dao/dbManagers/userManager.js";
import CartManager from "../dao/dbManagers/cartManager.js"
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config.js";

const router = Router();
const cartManager = new CartManager();
const userManager = new UserManager();

const generateJwtUser = (user) => {
  const { _id, first_name, last_name, cart, email, role } = user;
  const payload = { _id, name: `${first_name} ${last_name}`, cart, email, role };
  try {
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
    return token;
  } catch (err) {
    console.error(err);
  }
};

router.post(
  "/register",
  passport.authenticate("register", { session: false, failureRedirect: "/failRegister" }),
  async (req, res, next) => {
    try {
      // Crear carrito vacío para el usuario
      await cartManager.createEmptyCart(req.user._id);

      // Continuar al siguiente middleware
      next();
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  },
  async (req, res) => {
    // Crear el payload del token
    const payload = {
      _id: req.user._id,
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
    };

    // Firmar el token con el secret key
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

    // Enviar la respuesta con el token
    res.cookie('jwtCookie', token, { httpOnly: true });
    res.status(200).json({ status: "success", message: "user registered", token: token });
  }
);

router.get("/failRegister", (req, res) => {
  console.log("Failed Register");
  return res.send({ status: "error", error: "authentication error" });
});

router.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body;
    const user = await userManager.getUserByEmail(email);

    if (!user) return res.status(401).send({ status: "error", error: "User does not exist" });

    if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Invalid credentials" });

    const token = generateJwtUser(user);

    return res.cookie("jwtCookie", token, { httpOnly: true }).send({
      status: "success",
      message: "Login succesful",
    });
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
  res.clearCookie("jwtCookie").send({ status: "success", message: "log out successful" })
});


//LOGIN CON GITHUB
router.get('/github', passport.authenticate('githublogin', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('githublogin', { failureRedirect: '/login', session: false }), async (req, res) => {
  const token = generateJwtUser(req.user);
  res.cookie('jwtCookie', token, { httpOnly: true });
  res.redirect('/');
})

//LOGIN CON GOOGLE

router.get('/google', passport.authenticate('googlelogin', { scope: ['profile', 'email'] }), async (req, res) => { });

router.get('/googlecallback', passport.authenticate('googlelogin', { failureRedirect: '/login', session: false }), async (req, res) => {
  const token = generateJwtUser(req.user);
  res.cookie('jwtCookie', token, { httpOnly: true });
  res.redirect('/');
})

export default router;