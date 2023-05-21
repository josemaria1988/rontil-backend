import { Router } from 'express';
import ProductController from '../controllers/products.controllers.js';

const router = Router();
const productController = new ProductController();

router.post('/', productController.addProduct);
router.get('/', productController.getProducts);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

export default router;