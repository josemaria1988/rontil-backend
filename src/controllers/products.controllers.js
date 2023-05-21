import ProductService from '../services/products.services.js';

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  addProduct = async (req, res) => {
    try {
      const newProduct = await this.productService.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getProducts = async (req, res) => {
    try {
      const products = await this.productService.getProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const updatedProduct = await this.productService.updateProduct(req.params.pid, req.body);
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await this.productService.deleteProduct(req.params.pid);
      if (deletedProduct) {
        res.status(200).json(deletedProduct);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default ProductController;