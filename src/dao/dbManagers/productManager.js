import productModel from "../models/products.model.js";

export default class ProductManager {
    constructor() { };

    getProducts = async (options) => {
        options = options || {};
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
          const products = await productModel.paginate(query, { page, limit, sort: sortOrder });
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
      
          const count = await productModel.countDocuments(filter);
          return count;
        } catch (error) {
          console.log(error);
          throw new Error('Error al contar los productos');
        }
      };

    getProductById = async (productId) => {
        try {
            const product = await productModel.findById(productId);
            return product;

        } catch (error) {
            console.log(error);
        }
    };

    addProduct = async (productData) => {
        try {
            const newProduct = new productModel(productData);
            const savedProduct = await newProduct.save();
            return savedProduct;

        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (productId, productData) => {
        const updatedProduct = await productModel.findByIdAndUpdate(productId, productData, { new: true });
        return updatedProduct;
    }

    deleteProduct = async (productId) => {
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        return deletedProduct;
    }

}



