import { Router } from "express";
import productManager from '../dao/dbManagers/productManager.js';
import CartManager from "../dao/dbManagers/cartManager.js";
import cartModel from "../dao/models/cart.model.js";
import { isAuthenticated, isAdmin } from "../utils.js";



const router = Router();
const manager = new productManager();
const cartManager = new CartManager();

//Renderizar HOME
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

//Renderizar Products
//Mostrar todos los productos
//Mostrar productos por categoría y con paginación
router.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category || "";
  const status = req.query.status;
  const sort = req.query.sort || "";

  const filters = {
    category,
    status: status !== undefined && status !== '' ? status === 'true' : undefined,
  };

  const options = {
    limit,
    page,
    filters,
    sort
  };

  try {
    const products = await manager.getProducts(options);
    const totalProducts = await manager.countProducts(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    if (!products) {
      res.status(500).send('Error al obtener los productos de la base de datos');
    } else {
      res.render('products', {
        products: products.docs,
        page,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        style: "styles.css",
        title: "Products",
        user: req.user, 
      });
    }
  } catch (error) {
    res.status(500).send('Error al obtener los productos: ' + error.message);
  }
});

//mostrar producto por id
router.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await manager.getProductById(pid);
  if (!product) {
    res.status(404).send(`No se encontró el producto con id ${pid}`);
  } else {
    return res.send({ status: "success", payload: product });
  }
});

//Renderizar perfil de usuario
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

// Renderizar todos los carritos (solo para administradores)
router.get('/all-carts', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render('allCarts', { carts, user: req.user, style: "styles.css", title: "Ordenes-Carritos" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener todos los carritos");
  }
});

export default router;