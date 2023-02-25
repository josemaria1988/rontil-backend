import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productId = 0;
    }

    loadProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.productId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
        }
    }

    saveProducts = async () => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error(`Error al escribir en el archivo ${this.path}: ${error}`);
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Error: Todos los campos son obligatorios");
            return;
        }

        if (this.products.some((product) => product.code === code)) {
            console.error(`Error: El código ${code} ya existe`)
            return;
        }

        const product = {
            id: ++this.productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(product);

        await this.saveProducts();

        console.log(`Producto agregado: ${product.title}`);
    }

    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            return this.products;
        } catch (error) {
            console.error(`Error al leer el archivo ${this.path}: ${error}`);
            return [];
        }
    }

    getProductById = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const product = this.products.find((product) => product.id === id);
            if(product) {
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
            console.error(`Error al actualizar el archivo ${this.path}: ${error}`);
        }
    }

    deleteProduct = async (id) => {
        try {
            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.error("Producto no encontrado");
                return;
            }

            this.products.splice(productIndex, 1);

            await this.saveProducts();

            console.log(`Producto eliminado con éxito`);
        } catch (error) {
            console.error(`Error al eliminar el archivo ${this.path}: ${error}`);
        }
    }
}

module.exports = ProductManager;