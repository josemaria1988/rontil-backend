import cartModel from "../models/cart.model.js";

class CartManager {
  constructor() { };

  //OBTENER CARRITO
  getCart = async (cid) => {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error("Carrito no encontrado");
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

      const newCart = new cartModel({
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

  //ACTUALIZAR CARRITO CON NUEVO PRODUCTO
  updateCartWithProducts = async (cartId, newProducts) => {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.items = [...cart.items, ...newProducts];
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

      await cart.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el carrito");
    }
  };

  // ACTUALIZAR CANTIDAD DE UN PRODUCTO EN EL CARRITO
  updateProductQuantity = async (cid, pid, newQuantity) => {
    try {
      const cart = await cartModel.findOne({ _id: cid });
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
deleteProductFromCart = async (cid, pid) => {
  try {
    const cart = await cartModel.findOne({ _id: cid });
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
  clearCart = async (cid) => {

    try {
      const cart = await cartModel.findOne({ _id: cid });
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
}

export default CartManager;