import { productModel } from "../models/products.model.js";

export default class ProductManager {
    constructor() { };

    getProducts = async () => {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            console.log(error);
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
        const updatedProduct = await productModel.findByIdAndUpdate(productId, productData, {new: true});
        return updatedProduct;
    }

    deleteProducut = async (productId) => {
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        return deletedProduct;
    }

}



