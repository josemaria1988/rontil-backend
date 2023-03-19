import express from "express";
import {Server} from 'socket.io';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cartsRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './Managers/ProductManager.js';

const app = express();
const port = 8080;

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

const manager = new ProductManager();


const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

let logs = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on('nuevo_producto', async (data) => {
    await manager.addProduct(data);
    const allProducts = await manager.getProducts();
    socket.emit('updateProducts', allProducts);
  });

})

export {socketServer};
