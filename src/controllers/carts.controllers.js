import CartService from '../services/carts.services.js';
import ProductService from '../services/products.services.js';
import logger from '../winston.js';

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  getCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const cart = await this.cartService.getCart(uid);
      logger.info(`User ${uid} fetched their cart`);
      res.status(200).json(cart);
    } catch (error) {
      logger.error({
        message: 'Error getting user cart',
        userId: req.user._id,
        error: error.message,
      });
      res.status(500).json({ message: "Error al obtener el carrito del usuario" });
    }
  };

  createCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await this.productService.getProductById(productId);
      if (!product) {
        logger.warn(`Producto no encontrado: ${productId}`);
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      const price = product.price;
      const newCart = await this.cartService.createCart(req.user._id, productId, price, quantity);
      logger.info(`Carrito creado para el usuario: ${req.user._id}`);
      res.status(201).json(newCart);
    } catch (error) {
      logger.error(`Error creando carrito: ${error.message}`);
      res.status(500).json({ message: "Error al crear el carrito" });
    }
  };

  updateCartWithProducts = async (req, res) => {
    const uid = req.user._id;
    const newProducts = req.body.items;

    try {
      const updatedCart = await this.cartService.updateCartWithProducts(uid, newProducts);
      logger.info(`Carrito actualizado para el usuario: ${uid} con productos: ${JSON.stringify(newProducts)}`);
      res.json(updatedCart);
    } catch (error) {
      logger.error(`Error al agregar productos al carrito: ${error.message}`);
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const uid = req.user._id;
      const pid = req.params.pid;
      const { quantity } = req.body;
  
      const updatedCart = await this.cartService.updateProductQuantity(uid, pid, quantity);
      logger.info(`Cantidad de producto actualizada para el usuario: ${uid}, producto: ${pid}, cantidad: ${quantity}`);
      res.status(200).json(updatedCart);
    } catch (error) {
      logger.error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
      res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
    }
  };

  deleteProductFromCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const pid = req.params.pid;
      const updatedCart = await this.cartService.deleteProductFromCart(uid, pid);
      logger.info(`Producto eliminado del carrito para el usuario: ${uid}, producto: ${pid}`);
      res.json(updatedCart);
    } catch (error) {
      logger.error(`Error al eliminar producto del carrito: ${error.message}`);
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const updatedCart = await this.cartService.clearCart(uid);
      logger.info(`Carrito limpiado para el usuario: ${uid}`);
      res.status(200).json({
        status: 'success',
        message: 'Todos los productos eliminados del carrito',
        cart: updatedCart
      });
    } catch (error) {
      logger.error(`Error al limpiar el carrito: ${error.message}`);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
  
  getAllCarts = async (req, res) => {
    try {
      const carts = await this.cartService.getAllCarts();
      logger.info('Todos los carritos obtenidos');
      res.status(200).json(carts);
    } catch (error) {
      logger.error(`Error al obtener todos los carritos: ${error.message}`);
      res.status(500).json({ message: "Error al obtener todos los carritos" });
    }
  };
  
  checkout = async (req, res) => {
    try {
      const uid = req.user._id;
      const cid = await this.cartService.getCart(uid);
      const { availableProducts, total, missingProducts } = await this.cartService.checkout(uid);
      logger.info(`Checkout exitoso para el usuario: ${uid}`);
      res.json({ cid: cid._id, availableProducts: availableProducts, missingProducts: missingProducts, total: total });
    } catch (error) {
      logger.error(`Error en el proceso de checkout: ${error.message}`);
      res.status(500).send(error.message);
    }
  };

}

export default CartController;