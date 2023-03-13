import fs from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path || '../files/cart.json';
    this.carts = [];
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
      await fs.promises.writeFile(this.path, data, "utf-8");
      console.log('Carritos guardados');
    } catch (error) {
      console.error(`Error al guardar carritos: ${error.message}`);
      throw error;
    }
  };

  createCart = async () => {
    try {
      await this.leer_carts_json();

      const lastCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
      const newCartId = lastCartId + 1;

      const newCart = {
        id: newCartId,
        products: [],
      };

      this.carts.push(newCart);

      await this.saveCarts();

      console.log(`Carrito creado con éxito: ${newCartId}`);

      return newCartId;
    } catch (error) {
      console.error(`Error al crear un nuevo carrito: ${error.message}`);
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

  addProductToCart = async (cartId, productId, quantity) => {
    try {
      await this.leer_carts_json();
  
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        const newCartId = await this.createCart();
        this.carts.push({ id: newCartId, products: [{ id: productId, quantity: quantity }] });
      } else {
        const productIndex = this.carts[cartIndex].products.findIndex((product) => product.id === productId);
        if (productIndex === -1) {
          this.carts[cartIndex].products.push({ id: productId, quantity: quantity });
        } else {
          this.carts[cartIndex].products[productIndex].quantity += quantity;
        }
      }
  
      await this.saveCarts();
  
      console.log(`Producto agregado al carrito ${cartId} con éxito: ${productId}`);
  
      return this.carts[cartIndex];
    } catch (error) {
      console.error(`Error al agregar el producto al carrito ${cartId}: ${error.message}`);
      throw error;
    }
  };

}