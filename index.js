import ProductManager from "./ProductManager.js";

//Se creará una instancia de la clase “ProductManager”
const path = './files/products.json'
const manager = new ProductManager(path);


//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
const test1_read = async () => {
  try {
    const products = await manager.getProducts();
    console.log(products);
  } catch (error) {
    console.log(error);
  }
};

/*Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25*/

const test2_add = async () => {
  try {
    const product = {
      title: "producto prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25,
    };
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
  } catch (error) {
    console.log(error.message);
  }
};

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
const test3_read = async () => {
  try {
    const products = await manager.getProducts();
    console.log(products);
  } catch (error) {
    console.log(error);
  }
};

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
const test4_findId = async () => {
  try {
    const product = await manager.getProductById(1);
    console.log(product);
  } catch (error) {
    console.log(error);
  }
};

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
const test5_update = async () => {
  try {
    const updatedProduct = await manager.updateProduct(1, {
      title: "producto de prueba actualizado",
      description: "Este es un producto de prueba actualizado",
      price: 500, //Cambiamos el precio del producto!
      thumbnail: "Imagen actualizada",
      code: "def456",
      stock: 30,
    });
    console.log(updatedProduct);
  } catch (error) {
    console.log(error);
  }
};

//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
const test6_delete = async () => {
  try {
    const deletedProduct = await manager.deleteProduct(3);
    console.log(deletedProduct);
  } catch (error) {
    console.log(error);
  }
};

const test7_addMore = async () => {
  try {
    const product = {
      title: "nuevo producto",
      description: "Este es un producto es más mejor",
      price: 10000,
      thumbnail: "Sin imagen",
      code: "abc321",
      stock: 55000,
    };
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
  } catch (error) {
    console.log(error.message);
  }
};

const test8_addMore = async () => {
  try {
    const product = {
      title: "nuevo producto",
      description: "Este es un producto es mucho más mejor",
      price: 15000,
      thumbnail: "Sin imagen",
      code: "abc213",
      stock: 105000,
    };
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
  } catch (error) {
    console.log(error.message);
  }
};

test1_read();
test2_add();
test3_read();
test4_findId();
test5_update();
test6_delete();
test7_addMore();
test8_addMore();