import { Router } from 'express';
import ProductManager from '../Managers/ProductManager.js';

const manager = new ProductManager('../files/products.json');

const router = Router();

router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  if (!products) {
    res.status(500).send('Error al obtener los productos');
  } else {
    res.json(products);
  }
});

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await manager.getProductById(pid);
  if (!product) {
    res.status(404).send(`No se encontró el producto con id ${pid}`);
  } else {
    res.json(product);
  }
});

router.post('/', async (req, res) => {
  try {
    let newProduct = req.body
    await manager.addProduct(newProduct)
    console.log(newProduct)
    res.json(newProduct)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const fieldsToUpdate = req.body
    const updatedProduct = await manager.updateProduct(pid, fieldsToUpdate);
    console.log(updatedProduct);
    res.json(updatedProduct)
  } catch(error) {
    res.status(500).json({error: error.message})
  }
})

export default router;