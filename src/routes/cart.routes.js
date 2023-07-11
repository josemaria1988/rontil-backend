import { Router } from 'express';
import CartController from '../controllers/carts.controllers.js';
import { isAuthenticated, isAdmin, isProductOwner } from "../utils.js";
import TicketController from '../controllers/tickets.controller.js';
import { getSwaggerOptions } from '../swagger.js';

const router = Router();
const cartController = new CartController();
const ticketsController = new TicketController();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API para gestionar el carrito de compras
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener el carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 */
router.get('/', isAuthenticated, cartController.getCart);

/**
 * @swagger
 * /api/carts/cart:
 *   post:
 *     summary: Crear un nuevo carrito para el usuario
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 */
router.post('/cart', isAuthenticated, cartController.createCart);

/**
 * @swagger
 * /api/carts/cart:
 *   put:
 *     summary: Actualizar el carrito del usuario con nuevos productos
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres el dueño del producto
 */
router.put('/cart', isAuthenticated, isProductOwner, cartController.updateCartWithProducts);

/**
 * @swagger
 * /api/carts/cart/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito del usuario
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres el dueño del producto
 */
router.put('/cart/:pid', isAuthenticated, isProductOwner, cartController.updateProductQuantity);

/**
 * @swagger
 * /api/carts/cart/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito del usuario
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres el dueño del producto
 */
router.delete('/cart/:pid', isAuthenticated, isProductOwner, cartController.deleteProductFromCart);

/**
 * @swagger
 * /api/carts/cart:
 *   delete:
 *     summary: Vaciar el carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 */
router.delete('/cart', isAuthenticated, cartController.clearCart);

/**
 * @swagger
 * /api/carts/all:
 *   get:
 *     summary: Obtener todos los carritos (solo para administradores)
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carritos obtenidos exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres un administrador
 */
router.get('/all', isAdmin, cartController.getAllCarts);

/**
 * @swagger
 * /api/carts/{cid}/checkout:
 *   get:
 *     summary: Realizar el proceso de checkout del carrito
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito a realizar el checkout
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Checkout realizado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres el dueño del carrito
 */
router.get('/:cid/checkout', isAuthenticated, cartController.checkout);

/**
 * @swagger
 * /api/carts/{cid}/checkout/confirmation:
 *   post:
 *     summary: Generar un ticket de confirmación del checkout
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito a generar el ticket de confirmación
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Ticket de confirmación generado exitosamente
 *       401:
 *         description: No se ha iniciado sesión
 *       403:
 *         description: Acceso denegado. No eres el dueño del carrito
 */
router.post('/:cid/checkout/confirmation', isAuthenticated, ticketsController.generateTicket);

export default router;