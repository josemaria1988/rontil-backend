import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import CartManager from "./dao/dbManagers/cartManager.js";
import jwt from "jsonwebtoken"

const cartManager = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userManager.getUserByEmail(decoded.email);
    if (!user) {
      return res.redirect('/auth/login');
    }

    req.user = user;

    const cart = await cartManager.getCart(user._id);
    if (cart) {
      req.user.cart = cart;
    } else {
      console.error("Error al obtener el carrito del usuario");
    }

    next();
  } catch (err) {
    console.error(err);
    return res.redirect('/auth/login');
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso denegado. No eres un administrador." });
  }
};

export default __dirname;
