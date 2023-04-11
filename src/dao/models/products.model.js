import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: [{ type: String }],
})

const productModel = mongoose.model(productsCollection, productsSchema);

export { productModel };