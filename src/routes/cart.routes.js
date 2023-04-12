import { Router } from 'express';
//import CartManager from '../dao/fileManagers/CartManager.js';
import CartManager from '../dao/dbManagers/cartManager.js';

const manager = new CartManager();

const router = Router();



// Crea un nuevo carrito
/* router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.json(newCart)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;
    const newProduct = await manager.addProductToCart(cid, pid, quantity)
    res.json(newProduct)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}); */

// Obtener un carrito por id
/* router.get('/:cid', async (req, res) => {
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
}); */

// Agrega un producto a un carrito
/* router.post('/:cid/product/:pid', async (req, res) => {
  
}); */

export default router;