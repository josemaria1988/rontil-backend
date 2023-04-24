import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import CartManager from "./dao/dbManagers/cartManager.js";

const cartManager = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const userId = req.user._id;

    try {
      const cart = await cartManager.getCart(userId);
      if (cart) {
        req.user.cart = cart;
      } else {
        console.error("Error al obtener el carrito del usuario");
      }
    } catch (error) {
      console.error("Error al obtener el carrito del usuario:", error.message);
    }

    return next();
  }

  res.redirect("/auth/login");
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso denegado. No eres un administrador." });
  }
};

export default __dirname;
