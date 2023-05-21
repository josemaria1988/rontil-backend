import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import CartsServices from "../services/carts.services.js";
import UsersServices from "../services/users.services.js";
import jwt from "jsonwebtoken";
import config from "../config.js";

const cartManager = new CartsServices();
const userManager = new UsersServices();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

//VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
export const isAuthenticated = async (req, res, next) => {
  if (req.user) {
    try {
      // Buscar al usuario en la base de datos
      const user = await userManager.getUserByEmail(req.user.email);
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
  } else {
    return res.redirect('/auth/login');
  }
};

//LEER COOKIE, VERIFICAR TOKEN Y GUARDAR DATOS EN REQ.USER PARA QUE LLEGUEN A LAS VISTAS DE HANDLEBARS
export const decodeToken = (req, res, next) => {
  // Leer la cookie
  const token = req.cookies['jwtCookie'];
  // Verificar el token
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      next();
    }
  } else {
    next();
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
