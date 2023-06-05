import { Router } from 'express';
import CartController from '../controllers/carts.controllers.js';
import { isAuthenticated, isAdmin } from "../utils.js";
import TicketController from '../controllers/tickets.controller.js';

const router = Router();
const cartController = new CartController();
const ticketsController = new TicketController();

router.get('/', isAuthenticated, cartController.getCart);
router.post('/cart', isAuthenticated, cartController.createCart);
router.put('/cart', isAuthenticated, cartController.updateCartWithProducts);
router.put('/cart/:pid', isAuthenticated, cartController.updateProductQuantity);
router.delete('/cart/:pid', isAuthenticated, cartController.deleteProductFromCart);
router.delete('/cart', isAuthenticated, cartController.clearCart);
router.get('/all', isAdmin, cartController.getAllCarts);
router.get('/:cid/checkout', isAuthenticated, cartController.checkout);
router.get('/:cid/checkout/confirmation', isAuthenticated, ticketsController.generateTicket);

export default router;