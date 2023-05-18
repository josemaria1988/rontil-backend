import express from "express";
import morgan from "morgan";
import socket from "./socket.js";
import handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import __dirname from "./utils.js";
import cartsRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import chatRouter from './routes/chat.routes.js';
import cookieParser from "cookie-parser";
import sessionsRouter from "./routes/sessions.routes.js";
import passport from "passport";
import initializePassport from "./auth/passport.js";
import database from "./db.js";
import createAdminUser from "./init.js";
import { decodeToken } from "./utils.js";

// Initialization Express
const app = express();
const port = 8080;

//Database connection
database.connect();

//Middlewares
app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const hbs = expressHandlebars.create({
  handlebars: handlebars,
  extname: 'handlebars',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: (val1, val2) => {
      return val1 === val2;
    },
    json: function(context) {
      return JSON.stringify(context);
    }
  }
})

// Vistas de Handlebars
app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
/* handlebars.registerHelper("eq", (val1, val2) => {
  return val1 === val2;
}); */

//User Sessions
app.use(cookieParser());
initializePassport()
app.use(passport.initialize());


app.use(decodeToken);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use("/", viewsRouter);
app.use("/auth", sessionsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

socket.connect(httpServer);

// createAdminUser();
