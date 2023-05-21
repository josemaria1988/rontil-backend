import mongoose from "mongoose";
import productsSchema from '../schemas/products.schema.js';

const productsCollection = "products";
const productsRepository = mongoose.model(productsCollection, productsSchema);

export default productsRepository;