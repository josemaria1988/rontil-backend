import express from "express";
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/cart.routes.js';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server} from 'socket.io';
import viewsRouter from './routes/views.routes.js';

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



const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

let logs = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message1", (data) => {
    console.log(data);
  })

  socket.on("message2", (data) => {
    logs.push({socketId: socket.id, message: data});
    socketServer.emit("log", {logs});
  })

  socketServer.emit('message2', 'Hola mundo desde socket backend!')
})