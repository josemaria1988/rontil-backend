import ProductsRepository from "../dao/repositories/products.repository.js";

const productRepository = new ProductsRepository();

class ProductsServices {
  
  getProducts = async (req) => {
    options = req || {};
    const limit = options.limit || 10;
    const page = options.page || 1;
    const filters = options.filters || {};
    const sort = options.sort || undefined;
  
    const query = { };
  
    if (filters.category) {
      query.category = filters.category;
    }
  
    if (filters.status) {
      query.status = filters.status === "available" ? true : false;
    }
  
    const sortOrder = {};
  
    if (sort === 'price_asc') {
      sortOrder.price = 1;
    } else if (sort === 'price_desc') {
      sortOrder.price = -1;
    }
  
    try {
      const products = await productRepository.paginate(query, { page, limit, sort: sortOrder });
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  countProducts = async (query) => {
    try {
      const filter = {};
  
      if (query) {
        if (query.name) {
          filter.name = { $regex: query.name, $options: 'i' };
        }
  
        if (query.category) {
          filter.category = query.category;
        }
  
        if (query.status !== undefined) { // Comprueba si el status está definido
          filter.status = query.status;
        }
      }
  
      const count = await productRepository.countDocuments(filter);
      return count;
    } catch (error) {
      console.log(error);
      throw new Error('Error al contar los productos');
    }
  };

  getProductById = async (productId) => {
    return await productRepository.findById(productId);
  };

  addProduct = async (productData) => {
    const newProduct = new productRepository(productData);
    return await newProduct.save();
  };

  updateProduct = async (productId, productData) => {
    return await productRepository.findByIdAndUpdate(productId, productData, { new: true });
  };

  deleteProduct = async (productId) => {
    return await productRepository.findByIdAndDelete(productId);
  };
}

export default ProductsServices;