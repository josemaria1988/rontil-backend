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
      /* title: "producto de prueba actualizado dos veces",
      description: "chacachacachaca probando", */
      price: 15500, //Cambiamos el precio del producto!
      /* thumbnail: "Imagen actualizada",
      code: "def456",
      stock: 30, */
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
      code: "abc323",
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
      code: "abc218",
      stock: 105000,
    };
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
  } catch (error) {
    console.log(error.message);
  }
};

const test9_addMore = async () => {
  try {
    const product = {
      title: "otro nuevo producto",
      description: "Este es un producto es mucho más mejorable",
      price: 15000,
      thumbnail: "Sin imagen",
      code: "abc217",
      stock: 105000,
    };
    const newProduct = await manager.addProduct(product);
    console.log(newProduct);
  } catch (error) {
    console.log(error.message);
  }
};

const ejecutar = async () => {
  try {
    await test1_read()
  }catch (error) {
    return Promise.reject(error);
};
  try {
    await test2_add()
  }catch (error) {
    return Promise.reject(error);
  };
  try {
    await test3_read()
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test4_findId()
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test5_update();
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test6_delete();
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test7_addMore();
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test8_addMore();
  }catch (error) {
    return Promise.reject(error);
  }
  try {
    await test9_addMore();
  }catch (error) {
    return Promise.reject(error);
  }
}

ejecutar()






