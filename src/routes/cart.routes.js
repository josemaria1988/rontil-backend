import { Router } from 'express';
import CartManager from '../dao/dbManagers/cartManager.js';
import ProductManager from '../dao/dbManagers/productManager.js';

const cartManager = new CartManager();
const productManager = new ProductManager();

const router = Router();

//Obtener un carrito por ID de Usuario
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCart(req.params.cid);
    const populatedCart = await cart.populate('products.product').execPopulate();
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//CREAR CARRITO ASOCIADO AL USUARIO
router.post("/", async (req, res) => {
  try {
      const { userId, productId, quantity } = req.body;

      // Obtén el producto por ID para asegurarte de que exista y obtener su precio
      const product = await productManager.getProductById(productId);
      if (!product) {
          res.status(404).json({ message: "Producto no encontrado" });
          return;
      }

      const price = product.price;

      // Llama a la función createCart con los datos requeridos
      const newCart = await cartManager.createCart(userId, productId, price, quantity);

      res.status(201).json(newCart);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el carrito" });
  }
});

//AGREGAR MÁS PRODUCTOS AL CARRITO
router.put("/:cid", async (req, res) => {
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
router.put("/:cid/products/:pid", async (req, res) => {
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
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);

    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado o cantidad reducida en el carrito',
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

//ELIMINAR CARRITO
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.removeAllProductsFromCart(cid);

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

