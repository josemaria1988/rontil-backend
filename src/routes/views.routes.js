import { Router } from "express";
import { isAuthenticated, isAdmin } from "../utils.js";
import ViewsController from "../controllers/views.controllers.js";

const router = Router();
const viewController = new ViewsController();

router.get("/", viewController.getHome);
router.get('/products', isAuthenticated, viewController.getProducts);
router.get('/products/:pid', isAuthenticated, viewController.getProductById);
router.get("/auth/login", viewController.getLogin);
router.get("/auth/current", isAuthenticated, viewController.getCurrentUser);
router.get("/cart", isAuthenticated, viewController.getCart);
router.get("/all-carts", isAuthenticated, isAdmin, viewController.getAllCarts)
router.get("/checkout", isAuthenticated, viewController.checkout);
router.get('/ticket', isAuthenticated, viewController.getTicket);

export default router;