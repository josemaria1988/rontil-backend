import { Router } from 'express';
import CartManager from '../dao/dbManagers/cartManager.js';
import ProductManager from '../dao/dbManagers/productManager.js';
import {isAuthenticated} from "../utils.js";

const cartManager = new CartManager();
const productManager = new ProductManager();

const router = Router();

//OBTENER CARRITO POR ID DE USUARIO EN SESION.
router.get('/cart', isAuthenticated, async (req, res) => {
  console.log("Inicio del controlador del carrito");
  try {
    const uid = req.session.user._id;
    console.log('User ID:', uid);
    const cart = await cartManager.getCart(uid)
    console.log(cart._id)
    res.render("cart", { cart: cart, cid: cart._id, user: req.session.user, style: "styles.css", title: "Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el carrito del usuario" });
  }
});

//CREAR CARRITO ASOCIADO AL USUARIO
router.post("/", isAuthenticated, async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      // Obtener el producto por ID para asegurar de que exista y obtener su precio
      const product = await productManager.getProductById(productId);
      if (!product) {
          res.status(404).json({ message: "Producto no encontrado" });
          return;
      }

      const price = product.price;

      // Llama a la función createCart con los datos requeridos
      const newCart = await cartManager.createCart(req.user._id, productId, price, quantity);

      res.status(201).json(newCart);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el carrito" });
  }
});

//AGREGAR MÁS PRODUCTOS AL CARRITO
router.put("/:cid", isAuthenticated, async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.items;

    const updatedCart = await cartManager.updateCartWithProducts(cid, newProducts);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el carrito" });
  }
});

//ACTUALIZAR CANTIDAD EN EL CARRITO
router.put("/:cid/products/:pid", isAuthenticated, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

//ELIMINAR PRODUCTO DE UN CARRITO
router.delete('/:cid/products/:pid', isAuthenticated, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//ELIMINAR CARRITO
router.delete('/:cid', isAuthenticated, async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.clearCart(cid);

    res.status(200).json({
      status: 'success',
      message: 'Todos los productos eliminados del carrito',
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});


export default router;

