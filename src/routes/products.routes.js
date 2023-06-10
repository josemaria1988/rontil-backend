import { Router } from 'express';
import ProductController from '../controllers/products.controllers.js';
import { isAuthenticated, isAdmin } from "../utils.js";

const router = Router();
const productController = new ProductController();

router.post('/', isAuthenticated, isAdmin, productController.addProduct);
router.get('/', productController.getProducts);
router.put('/:pid', isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/:pid', isAuthenticated, isAdmin, productController.deleteProduct);

export default router;