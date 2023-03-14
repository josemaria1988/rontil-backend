import express from "express";
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/cart.routes.js';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";

const app = express();
const port = 8080;

app.use(express.json())
app.engine("handlebars", handlebars.engine());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});