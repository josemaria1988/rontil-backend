import { Router } from 'express';
import ProductsServices from '../services/products.services.js';

const manager = new ProductsServices();

const router = Router();

//crear un nuevo producto
router.post('/', (req, res) => manager.addProduct(req, res));

//modificar un producto
router.put('put', (req, res) => manager.updateProduct(req, res));

//borrar un producto
router.delete('/:pid', (req, res) => manager.deleteProduct(pid));

export default router;