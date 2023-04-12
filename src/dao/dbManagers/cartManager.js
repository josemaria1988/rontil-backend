import cartModel from "../models/cart.model.js";

export default class CartManager {
    constructor () {};

    createCart = async (userId) => {
        try {
            const newCart = new cartModel({user: userId});
            return await newCart.save();
        } catch (error) {
            console.log(error);
        }
    };

    getCartByUserId = async (userId) => {
        try {
            return await cartModel.findOne({user: userId}).populate('items.product');
        } catch (error) {
            console.log(error);
        }
    };

    addProductToCart = async (userId, productId, quantity, price) => {
        try {
            const cart = await this.getCartByUserId(userId);
            const itemIndex = cart.items.findIndex(item => item.product.toString() == productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price += price * quantity;
            } else {
                cart.items.push({ product: productId, quantity, price: price*quantity});
            }

            cart.totalPrice += price * quantity;
            return await cart.save();

        } catch (error) {
            console.log(error);
        }
    };

    updateCartProduct = async (userId, productId, quantity, price) => {
        try {
            const cart = await this.getCartByUserId(userId);
            const itemIndex = cart.items.findIndex(item => item.product.toString() == productId);

            if (itemIndex > -1) {
                cart.totalPrice -= cart.items[itemIndex].price;
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].price = price * quantity;
                cart.totalPrice += price * quantity;

                return await cart.save();
            } else {
                throw new Error ( 'Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.log(error);
        };

        deleteSingleProductFromCart = async (userId, productId) => {
            try {
                const cart = await this.getCartByUserId(userId);
                const itemIndex = cart.items.findIndex(item => item.product.toString() == productId);

                if (itemIndex > -1) {
                    cart.totalPrice -= cart.items[itemIndex].price;
                    cart.items.splice(itemIndex, 1);
                    return await cart.save();
                } else {
                    throw new Error ('Producto no encontrado en el carrito');
                }
            } catch (error) {
                console.log(error);
            };

            clearCart = async (userId) => {
                try {
                    const cart = await this.getCartByUserId(userId);
                    cart.items = [];
                    cart.totalPrice = 0;
                    return await cart.save();

                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

}