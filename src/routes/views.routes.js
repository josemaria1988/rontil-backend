import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";
import { socketServer } from "../app.js";

const manager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
    const products = await manager.getProducts();
    res.render("home", { products });

});

router.get("/realTimeProducts", async (req, res) => {
    const products = await manager.getProducts();
    socketServer.emit("products", products)
    res.render("realTimeProducts", { products });
});

export default router