import ProductManager from './ProductManager.js';

const manager = new ProductManager();

const working = async () => {
    let consulta = await manager.getProducts();
    console.log(consulta);
}

working();