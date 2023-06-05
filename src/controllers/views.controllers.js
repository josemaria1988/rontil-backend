import ProductsController from '../services/products.services.js';
import CartsController from "../services/carts.services.js";
import cartRepository from "../dao/repositories/carts.repository.js";
import GetCurrentUserDTO from '../dto/user.dto.js';

const productController = new ProductsController();
const cartController = new CartsController();

class ViewsController {
  constructor() {}

  getHome = async (req, res) => {
    const products = JSON.parse(JSON.stringify(await productController.getProducts(req)));
    let cartId = null;
    if (req.user) {
      const cart = await cartRepository.findOne({ user: req.user._id });
      if (cart) {
        cartId = cart._id;
      }
    }
    res.render("home", { products: products.docs, user: req.user, cartId: cartId, style: "styles.css", title: "Products" });
  };

  getLogin  = async  (req, res) => {
    res.render("login", {style: "styles.css", title: "Login"})
  }

  getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const category = req.query.category || "";
    const status = req.query.status;
    const sort = req.query.sort || "";

    const filters = {
      category,
      status: status !== undefined && status !== '' ? status === 'true' : undefined,
    };

    const options = {
      limit,
      page,
      filters,
      sort
    };

    try {
      const products = await productController.getProducts(options);
      const totalProducts = await productController.countProducts(filters);
      const totalPages = Math.ceil(totalProducts / limit);

      if (!products) {
        res.status(500).send('Error al obtener los productos de la base de datos');
      } else {
        res.render('products', {
          products: products.docs,
          page,
          totalPages,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          style: "styles.css",
          title: "Products",
          user: req.user, 
        });
      }
    } catch (error) {
      res.status(500).send('Error al obtener los productos: ' + error.message);
    }
  };

  getProductById = async (req, res) => {
    const pid = req.params.pid;
    const product = await productController.getProductById(pid);
    if (!product) {
      res.status(404).send(`No se encontró el producto con id ${pid}`);
    } else {
      return res.render('singleproduct', { product: product, style: "styles.css", title: "Single Product", user: req.user });
    }
  };

  getCart = async (req, res) => {
    console.log("Inicio del controlador del carrito");
    try {
      const uid = req.user._id;
      const cart = await cartController.getCart(uid)
      res.render("cart", { cart: cart, cid: cart._id, user: req.user, style: "styles.css", title: "Cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el carrito del usuario" });
    }
  };
  
  getAllCarts = async (req, res) => {
    try {
      const carts = await cartController.getAllCarts();
      res.render('allCarts', { carts, user: req.user, style: "styles.css", title: "Ordenes-Carritos" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener todos los carritos");
    }
  };

  getCurrentUser = async (req, res) => {
    const userDTO = new GetCurrentUserDTO(req.user);
    res.render("perfil", { user: userDTO, style: "styles.css", title: "Perfil" });
  };

  checkout = async (req, res) => {
    const uid = req.user._id
    const cid = await cartController.getCart(uid)
    const { availableProducts, missingProducts, total } = await cartController.checkout(uid)
    console.log(availableProducts)
        res.render("checkout", { cid: cid._id, products: availableProducts, missingProducts: missingProducts, total: total, style: "styles.css", title: "Confirmation", user: req.user });
    };

    getTicket = async (req, res) => {
      return
    }
}

export default ViewsController;