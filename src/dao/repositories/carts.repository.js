import mongoose from "mongoose";
import cartsSchema from '../schemas/carts.schema.js';

const cartsCollection = "carts";
const cartRepository = mongoose.model(cartsCollection, cartsSchema);

export default cartRepository;