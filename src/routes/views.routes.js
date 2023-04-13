import { Router } from "express";
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import productManager from '../dao/dbManagers/productManager.js';
import CartManager from "../dao/dbManagers/cartManager.js";

const router = Router();
const manager = new productManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts(req)));
  console.log(products)
  res.render("home", { products: products.docs, style: "styles.css", title: "Products" });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts(req)));
  console.log(products)
  res.render("realTimeProducts", {products: products.docs, style: "styles.css", title: "Real Time Products"});
});

export default router;