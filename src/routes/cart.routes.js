import { Router } from 'express';
import CartManager from '../Managers/CartManager.js';

const manager = new CartManager('../files/cart.json');

const router = Router();

// Crea un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCartId = await manager.createCart();
    const newCart = await manager.getCartById(newCartId);
    console.log(newCart);
    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtiene un carrito por id
router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `No se encontró el carrito con id ${req.params.cid}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agrega un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const quantity = JSON.parse(req.body.quantity)
    const cart = await manager.addProductToCart(req.params.cid, req.params.pid, quantity);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `No se encontró el carrito con id ${req.params.cid}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;