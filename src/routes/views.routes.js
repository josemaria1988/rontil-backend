import { Router } from "express";
//import ProductManager from "../dao/fileManagers/ProductManager.js";
import productManager from '../dao/dbManagers/productManager.js';
import CartManager from "../dao/dbManagers/cartManager.js";

const router = Router();
const manager = new productManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts()));
  res.render("home", { products, style: "styles.css", title: "Products" });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts()));
  res.render("realTimeProducts", {products, style: "styles.css", title: "Real Time Products"});
});

router.get("/cart/:uid", async (req, res) => {
  const userId = req.params.uid;
  const cart = JSON.parse(JSON.stringify(await cartManager.getCartByUserId(userId)))
})

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

export default router;