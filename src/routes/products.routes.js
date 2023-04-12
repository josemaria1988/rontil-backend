import { Router } from 'express';
import ProductManager from '../dao/fileManagers/ProductManager.js';
import productManager from '../dao/dbManagers/productManager.js';

const manager = new productManager();

const router = Router();

//Mostrar todos los productos
router.get('/', async (req, res) => {

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const query = req.query.query || "";
  const sort = req.query.sort || "";

  const options = {
    limit,
    skip: (page -1 ) * limit,
    query,
    sort
  };

  try {
    const products = await manager.getProducts(options);
    if(!products) {
      res.status(500).send('Error al obtener los productos de la base de datos');
    } else {
      return res.send({status: "Success", payload: products});
    }
  } catch (error) {
    res.status(500).send('Error al obtener los productos: ' + error.message);
  }
})

//mostrar producto por id
router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await manager.getProductById(pid);
  if (!product) {
    res.status(404).send(`No se encontró el producto con id ${pid}`);
  } else {
    return res.send({ status: "success", payload: product });
  }
});

//crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    let newProduct = req.body
    await manager.addProduct(newProduct)
    console.log(newProduct)
    return res.send({ status: "success", payload: newProduct });

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

//modificar un producto
router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const fieldsToUpdate = req.body
    const updatedProduct = await manager.updateProduct(pid, fieldsToUpdate);
    console.log(updatedProduct);
    return res.send({ status: "success", payload: updatedProduct });
  } catch(error) {
    res.status(500).json({error: error.message})
  }
});

//borrar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await manager.deleteProduct(pid);
    return res.send({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

export default router;