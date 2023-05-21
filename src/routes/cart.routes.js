import { Router } from 'express';
import CartController from '../controllers/carts.controllers.js';
import { isAuthenticated, isAdmin } from "../utils.js";

const router = Router();
const cartController = new CartController();

router.get('/', isAuthenticated, cartController.getCart);
router.post('/cart', isAuthenticated, cartController.createCart);
router.put('/cart', isAuthenticated, cartController.updateCartWithProducts);
router.put('/cart/:pid', isAuthenticated, cartController.updateProductQuantity);
router.delete('/cart/:pid', isAuthenticated, cartController.deleteProductFromCart);
router.delete('/cart', isAuthenticated, cartController.clearCart);
router.get('/all', isAdmin, cartController.getAllCarts);

export default router;