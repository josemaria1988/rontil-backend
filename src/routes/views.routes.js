import { Router } from "express";
import ProductManager from "../dao/fileManagers/ProductManager.js";
import productManager from '../dao/dbManagers/productManager.js';

const router = Router();
const manager = new productManager();

router.get("/", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts()));
  res.render("home", { products, style: "styles.css", title: "Products" });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = JSON.parse(JSON.stringify(await manager.getProducts()));
  res.render("realTimeProducts", {products, style: "styles.css", title: "Real Time Products"});
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

export default router;