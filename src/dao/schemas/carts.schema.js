import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalPrice: { type: Number, default: 0 },
});

export default cartsSchema;