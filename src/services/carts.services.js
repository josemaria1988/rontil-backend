import cartRepository from "../dao/repositories/carts.repository.js";
import ProductsServices from "./products.services.js";

const productService = new ProductsServices();

class CartService {
  constructor() { };

  //OBTENER CARRITO
  getCart = async (uid) => {
    try {
      let cart = await cartRepository.findOne({ user: uid });
      if (!cart) {
        console.log("Carrito no encontrado, creando uno nuevo.");
        cart = await this.createEmptyCart(uid);
      }
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  //CREAR NUEVO CARRITO
  createCart = async (uid, newProduct, price, quantity) => {
    try {
      const newCartItem = {
        product: newProduct,
        price: price,
        quantity: quantity
      };

      const newCart = new cartRepository({
        user: uid,
        items: [newCartItem],
        totalPrice: price * quantity
      });

      const savedCart = await newCart.save();
      return savedCart;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear el carrito");
    }
  };

  //CREAR CARRITO VACÍO
  createEmptyCart = async (uid) => {
    try {
      const newCart = new cartRepository({
        user: uid,
        items: [],
        totalPrice: 0
      });

      const savedCart = await newCart.save();
      return savedCart;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear el carrito");
    }
  };

// ACTUALIZAR CARRITO CON NUEVO PRODUCTO
updateCartWithProducts = async (uid, newProducts) => {
  try {
    const cart = await cartRepository.findOne({ user: uid });
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    newProducts.forEach((newProduct) => {
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === newProduct.product.toString()
      );

      if (productIndex !== -1) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        cart.items[productIndex].quantity += newProduct.quantity;
      } else {
        // Si el producto no está en el carrito, lo agrega
        cart.items.push(newProduct);
      }
    });

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar el carrito");
  }
};

  // ACTUALIZAR CANTIDAD DE UN PRODUCTO EN EL CARRITO
  updateProductQuantity = async (uid, pid, newQuantity) => {
    try {
      const cart = await cartRepository.findOne({ user: uid });
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const productIndex = cart.items.findIndex(item => item.product.toString() === pid);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }
      const quantityDifference = newQuantity - cart.items[productIndex].quantity;
      cart.items[productIndex].quantity = newQuantity;
      cart.totalPrice += cart.items[productIndex].price * quantityDifference;
  
      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error('Error al actualizar la cantidad del producto en el carrito');
    }
  }

  // ELIMINAR UN PRODUCTO DEL CARRITO
  deleteProductFromCart = async (uid, pid) => {
    try {
      const cart = await cartRepository.findOne({user: uid});
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.items.findIndex(item => item.product.toString() === pid);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }

      // Restar el precio total del producto eliminado
      cart.totalPrice -= cart.items[productIndex].price * cart.items[productIndex].quantity;

      // Eliminar el producto del carrito
      cart.items.splice(productIndex, 1);

      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  //VACIAR UN CARRITO
  clearCart = async (uid) => {

    try {
      const cart = await cartRepository.findOne({ user: uid });
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.items = [];

      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error('Error al eliminar todos los productos del carrito');
    }
  }

  //SOLO PARA LAS RUTAS DE ADMIN
  getAllCarts = async () => {
    try {
      const carts = await cartRepository
        .find({})
        .populate("items.product")
        .exec();
  
      return carts;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      throw new Error("Error al obtener los carritos");
    }
  };

  checkout = async (uid) => {
    try {

      const cart = await this.getCart(uid)
      
      if (!cart || cart.items.length === 0) {
        throw new Error ('El carrito está vacío');
      }
      
      let total = 0;
      for (let item of cart.items) {
        const product = await productService.getProductById(item.product);
        if (product.stock < item.quantity) {
          throw new Error (`No hay suficiente stock para el producto ${product.title}`)
        }
        await productService.updateStock(product._id, item.quantity)
        total += item.quantity * product.price;
      }
      
      await this.clearCart(uid)
      
      return total
    } catch (error) {
      console.error(error);
      throw new Error('Error al realizar el checkout: ' + error.message);
    }


  }
}

export default CartService;