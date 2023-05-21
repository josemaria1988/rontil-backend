import CartService from '../services/carts.services.js';
import ProductService from '../services/products.services.js';

class CartController {
  constructor() {
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  getCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const cart = await this.cartService.getCart(uid);
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el carrito del usuario" });
    }
  };

  createCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
  
      const product = await this.productService.getProductById(productId);
      if (!product) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
  
      const price = product.price;
      const newCart = await this.cartService.createCart(req.user._id, productId, price, quantity);
  
      res.status(201).json(newCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el carrito" });
    }
  };

  updateCartWithProducts = async (req, res) => {
    const uid = req.user._id;
    const newProducts = req.body.items;

    try {
      const updatedCart = await this.cartService.updateCartWithProducts(uid, newProducts);
      res.json(updatedCart);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error.message);
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const uid = req.user._id;
      const pid = req.params.pid;
      const { quantity } = req.body;
  
      const updatedCart = await this.cartService.updateProductQuantity(uid, pid, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
    }
  };

  deleteProductFromCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const pid = req.params.pid;
      const updatedCart = await this.cartService.deleteProductFromCart(uid, pid);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
      const uid = req.user._id;
      const updatedCart = await this.cartService.clearCart(uid);
  
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
  };

  getAllCarts = async (req, res) => {
    try {
      const carts = await this.cartService.getAllCarts();
      res.status(200).json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener todos los carritos" });
    }
  };
}

export default CartController;