import mongoose from "mongoose";
import userModel from "./user.model.js";

const cartsCollection = "Products";

const cartsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalPrice: { type: Number, default: 0 },
});

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export { cartModel };