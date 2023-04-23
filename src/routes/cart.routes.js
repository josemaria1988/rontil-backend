import { Router } from 'express';
import CartManager from '../dao/dbManagers/cartManager.js';
import ProductManager from '../dao/dbManagers/productManager.js';
import {isAuthenticated} from "../utils.js";

const cartManager = new CartManager();
const productManager = new ProductManager();

const router = Router();

//OBTENER CARRITO POR ID DE USUARIO EN SESION.
router.get('/cart', isAuthenticated, async (req, res) => {
  try {
    const uid = req.user._id;
    const cart = await cartManager.getCart(uid);
    res.status(200).json(cart);
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

// Agregar un producto al carrito
router.put("/cart", isAuthenticated, async (req, res) => {
  const uid = req.user._id;
  const newProducts = req.body.items;

  try {
    const updatedCart = await cartManager.updateCartWithProducts(uid, newProducts);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

//ACTUALIZAR CANTIDAD EN EL CARRITO
router.put("/:uid/products/:pid", isAuthenticated, async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.updateProductQuantity(uid, pid, quantity);
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

