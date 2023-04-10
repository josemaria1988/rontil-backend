import fs from 'fs';
import __dirname from "../../utils.js";
import socket from "../../socket.js";

export default class CartManager {
  constructor(path) {
    this.path = `${__dirname}/files/cart.json`;
    this.carts = [];
    this.leer_carts_json();
  }

  leer_carts_json = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        this.carts = JSON.parse(data);
      } else {
        this.carts = [];
      }
      return this.carts;
    } catch (error) {
      console.error(`Error al leer el archivo ${this.path}: ${error}`);
      return null;
    }
  };

  saveCarts = async () => {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile(this.path, data, 'utf-8');
      console.log('Carritos guardados');
    } catch (error) {
      console.error(`Error al guardar carritos: ${error.message}`);
      throw error;
    }
  };

  
  getCartById = async (cartId) => {
    try {
      await this.leer_carts_json();
      const cart = this.carts.find((cart) => cart.id === parseInt(cartId));
      if (cart) {
        console.log(cart);
        return cart;
      } else {
        console.error(`No se encontró el carrito con id ${cartId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener el carrito con id ${cartId}: ${error.message}`);
      throw error;
    }
  };

  createCart = async () => {
    try {
      await this.leer_carts_json();
      const lastCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
      const newCartId = lastCartId + 1;

      const existingCart = await this.getCartById(newCartId);
      if (existingCart) {
        return existingCart
      } else {
        const newCart = {
          id: newCartId,
          products: []
        };
  
        this.carts.push(newCart);
  
        await this.saveCarts();
      }

      console.log(`Carrito creado con éxito: ${newCartId}`);

      return newCartId;
    } catch (error) {
      console.error(`Error al crear un nuevo carrito: ${error.message}`);
      throw error;
    }
  };
  
  addProductToCart = async (cartId, productId, quantity) => {
    try {
      const existingCart = await this.getCartById(cartId);
      if (existingCart) {
        const productIndex = existingCart.products.findIndex((product) => product.id === productId);
        if (productIndex === -1) {
          existingCart.products.push({ id: productId, quantity: quantity });
        } else {
          existingCart.products[productIndex].quantity += quantity;
        }

      } else {
        const newCartId = await this.createCart();
        this.carts.push({ id: newCartId, products: [{ id: productId, quantity: quantity }] });
        
      }

      await this.saveCarts();

      console.log(`Producto agregado al carrito ${cartId} con éxito: ${productId}`);

      return this.carts[existingCart];
    } catch (error) {
      console.error(`Error al agregar el producto al carrito ${cartId}: ${error.message}`);
      throw error;
    }
  };
}