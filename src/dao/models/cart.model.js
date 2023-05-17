import mongoose from "mongoose";
import userModel from "./user.model.js";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalPrice: { type: Number, default: 0 },
});

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export default cartModel;