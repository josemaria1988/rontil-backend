import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const manager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    const products = await manager.getProducts();
    res.render("home", { products });

});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
})

export default router