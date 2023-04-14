import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import socket from "./socket.js";
import handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import __dirname from "./utils.js";
import cartsRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import chatRouter from './routes/chat.routes.js';
import session from "express-session";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

dotenv.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@jmscluster0.gtmsfjl.mongodb.net/${dbName}?retryWrites=true&w=majority`)

const hbs = expressHandlebars.create({
  handlebars: handlebars,
  extname: 'handlebars',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})

app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session ({
  secret: "my_little_secret",
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use("/", viewsRouter);
app.use("/api/auth", authRouter);

const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

socket.connect(httpServer);
