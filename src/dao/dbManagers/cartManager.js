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

      //ACTUALIZAR CANTIDAD DE UN PRODUCTO EN EL CARRITO
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
      
          // Incrementar la cantidad en lugar de establecer un nuevo valor
          cart.items[productIndex].quantity += newQuantity;
      
          await cart.save();
          return cart;
        } catch (error) {
          console.log(error);
          throw new Error('Error al actualizar la cantidad del producto en el carrito');
        }
      }

      //REDUCIR CANTIDAD DE UN PRODUCTO HASTA ELIMINARLO

      removeProductFromCart = async (cid, pid) => {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
              throw new Error('Carrito no encontrado');
            }
        
            const productIndex = cart.items.findIndex(item => item.product.toString() === pid);
            if (productIndex === -1) {
              throw new Error('Producto no encontrado en el carrito');
            }
        
            if (cart.items[productIndex].quantity > 1) {
              cart.items[productIndex].quantity -= 1;
            } else {
              cart.items.splice(productIndex, 1);
            }
        
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