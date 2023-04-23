import { Router } from "express";
import productManager from '../dao/dbManagers/productManager.js';
import CartManager from "../dao/dbManagers/cartManager.js";
import cartModel from "../dao/models/cart.model.js";
import { isAuthenticated } from "../utils.js";



const router = Router();
const manager = new productManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts(req)));
  let cartId = null;
  if (req.user) {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (cart) {
      cartId = cart._id;
    }
  }
  res.render("home", { products: products.docs, user: req.user, cartId: cartId, style: "styles.css", title: "Products" });
});

router.get("/auth/perfil", isAuthenticated, async (req, res) => {
  res.render("perfil", { user: req.user, style: "styles.css", title: "Perfil" });
});

router.get("/auth/register", async (req, res) => {
  res.render("register", { style: "styles.css", title: "Register" })
});

router.get("/auth/login", async (req, res) => {
  res.render("login", { style: "styles.css", title: "Login" })
});

//Mostrar carrito por ID de usuario en sesion.
router.get('/cart', isAuthenticated, async (req, res) => {
  console.log("Inicio del controlador del carrito");
  try {
    const uid = req.user._id;
    const cart = await cartManager.getCart(uid)
    res.render("cart", { cart: cart, cid: cart._id, user: req.user, style: "styles.css", title: "Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el carrito del usuario" });
  }
});

export default router;