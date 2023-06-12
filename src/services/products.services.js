import productsRepository from "../dao/repositories/products.repository.js";
import { DatabaseError } from './errors/DatabaseError.js';
import { NotFoundError } from './errors/NotFoundError.js';

class ProductsServices {
  
  getProducts = async (req) => {
    let options = req || {};
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
      const products = await productsRepository.paginate(query, { page, limit, sort: sortOrder });
      return products;
    } catch (error) {
      throw new DatabaseError({
        message: 'Error buscando productos',
        details: {
          query: query,
          sort: sortOrder,
          pagination: {page, limit},
          error: error.message,
        },
      });
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
  
      const count = await productsRepository.countDocuments(filter);
      return count;
    } catch (error) {
      throw new DatabaseError({
        message: 'Error contando productos',
        details: {
          query: query,
          error: error.message,
        }
      });
    }
  };

  getProductById = async (productId) => {
    return await productsRepository.findById(productId);
  };

  addProduct = async (productData) => {
    try {
      const newProduct = new productsRepository(productData);
      return await newProduct.save();
    } catch (error) {
      throw new DatabaseError({
        message: 'Error añadiendo producto',
        details: {
          productData: productData,
          error: error.message,
        },
      });
    }
  };

  updateProduct = async (productId, productData) => {
    try {
      const product = await productsRepository.findByIdAndUpdate(productId, productData, { new: true });
  
      if (!product) {
        throw new NotFoundError({
          message: 'Producto no encontrado',
          details: {
            productId: productId,
          },
        });
      }
  
      return product;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new DatabaseError({
          message: 'Error actualizando producto',
          details: {
            productId: productId,
            productData: productData,
            error: error.message,
          },
        });
      }
    }
  };

  deleteProduct = async (productId) => {
    try {
      const product = await productsRepository.findByIdAndDelete(productId);
  
      if (!product) {
        throw new NotFoundError({
          message: 'Producto no encontrado',
          details: {
            productId: productId,
          },
        });
      }
  
      return product;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new DatabaseError({
          message: 'Error eliminando producto',
          details: {
            productId: productId,
            error: error.message,
          },
        });
      }
    }
  };

  updateStock = async (productId, quantity) => {
    try {
      // Buscar el producto
      let product = await productsRepository.findById(productId);

      if (!product) {
        throw new NotFoundError({
          message: 'Producto no encontrado',
          details: {
            productId: productId
          }
        });
      }

      // Actualizar el stock
      product.stock -= quantity;

      if (product.stock < 0) {
        throw new Error('No hay suficiente stock del producto');
      }

      // Guardar el producto
      await product.save();

      return product;
    } catch (error) {
      throw new DatabaseError({
        message: 'Error actualizando el stock del producto',
        details: {
          productId: productId,
          quantity: quantity,
          error: error.message,
        },
      });
    }
  }
}

export default ProductsServices;