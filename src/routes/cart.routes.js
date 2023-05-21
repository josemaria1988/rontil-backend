import { Router } from 'express';
import CartController from '../controllers/carts.controllers.js';

const router = Router();
const cartController = new CartController();

router.get('/', cartController.getCart);
router.post('/', cartController.createCart);
router.put('/', cartController.updateCartWithProducts);
router.put('/:pid', cartController.updateProductQuantity);
router.delete('/:pid', cartController.deleteProductFromCart);
router.delete('/', cartController.clearCart);
router.get('/all', cartController.getAllCarts);

export default router;