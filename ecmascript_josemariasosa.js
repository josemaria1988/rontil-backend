
// DECLARACION

class ProductManager {
    constructor() {
        this.products = [];
        this.productId = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
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

        console.log(`Producto agregado: ${product.title}`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if(product) {
            return product;
        } else {
            console.error("Producto no encontrado");
            return null;
        }
    }
}

//TESTING

//Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager();

// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

const sinProducts = manager.getProducts();
console.log(sinProducts);

/*Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25*/

manager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );

//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

const conProducts = manager.getProducts();
console.log(conProducts);

//Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

try {
    manager.addProduct (
        "otro producto",
        "Este es otro producto de prueba",
        150,
        "Sin imagen",
        "abc123",
        20
    );
} catch (error) {
    console.log(error)
}

//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

const productoExiste = manager.getProductById(1);
console.log(productoExiste);

const productoNoExiste = manager.getProductById(4);
if (productoNoExiste === undefined) {
    console.log("Producto no encontrado")
}