import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path || './files/products.json';
        this.products = [];
    }

    leer_archivo_json = async () => {
        try {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          this.products = JSON.parse(data);
          return this.products;
        } catch (error) {
          return Promise.reject(error);
        }
      }

    saveProducts = async () => {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, data, "utf-8");
            console.log("Productos guardados");
        } catch (error) {
            console.error(`Error al guardar productos: ${error.message}`);
            throw error;
        }
    };

    addProduct = async (product) => {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        try {
            await this.leer_archivo_json();

            if (this.products.some((p) => p.code === product.code)) {
                throw new Error(`El código ${product.code} ya existe`);
            }

            const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
            const newProductId = lastProductId + 1;

            const newProduct = {
                id: newProductId,
                ...product,
            };

            this.products.push(newProduct);

            await this.saveProducts();

            console.log(`Producto agregado: ${newProduct.title}`);

            return newProduct;
        } catch (error) {
            console.error(`Error al leer o actualizar el archivo ${this.path}: ${error.message}`);
            throw error;
        }
    };

    getProducts = async (limit) => {
        try {
            await this.leer_archivo_json();
            let products = this.products;
            if (limit) {
                products = products.slice(0, limit);
            }
            return products;
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
            return null;
        }
    }

    getProductById = async (id) => {
        try {
            await this.leer_archivo_json();
            const product = this.products.find((product) => product.id === id);
            if (product) {
                return product;
            } else {
                console.error("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
            return null;
        }
    }

    updateProduct = async (id, fieldsToUpdate) => {
        try {
            await this.leer_archivo_json();

            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.error("Producto no encontrado");
                return;
            }

            const updatedProduct = { ...this.products[productIndex], ...fieldsToUpdate };
            this.products[productIndex] = updatedProduct;

            await this.saveProducts();

            console.log(`Producto actualizado: ${updatedProduct.title}`);
        } catch (error) {
            console.error(`Error al leer o actualizar el archivo ${this.path}: ${error.message}`);
            throw error;
        }
    };
    deleteProduct = async (id) => {
        try {
            await this.leer_archivo_json();

            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.error("Producto no encontrado");
                return;
            }

            this.products.splice(productIndex, 1);

            await this.saveProducts();

            console.log(`Producto eliminado con éxito`);
        } catch (error) {
            console.error(`Error al leer o actualizar el archivo ${this.path}: ${error.message}`);
            throw error;
        }
    };
};