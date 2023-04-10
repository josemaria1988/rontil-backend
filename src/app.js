import express from "express";
import socket from "./socket.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cartsRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

socket.connect(httpServer);
