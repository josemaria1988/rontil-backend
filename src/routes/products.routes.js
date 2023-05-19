import { Router } from 'express';
import ProductManager from '../dao/dbManagers/productManager.js';

const manager = new ProductManager();

const router = Router();

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