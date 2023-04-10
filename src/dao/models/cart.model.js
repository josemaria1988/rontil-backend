import mongoose from "mongoose";

const cartsCollection = "Products";

const cartsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }],
    totalPrice: { type: Number, default: 0 },
  });

const cartModel = mongoose.model(cartsCollection, cartsSchema);

export { cartModel };