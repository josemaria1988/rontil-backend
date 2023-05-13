import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const colorSchema = new mongoose.Schema({
    id: Number,
    value: String,
    stock: Number,
    precio: Number,
    img: [String]
}, {_id: false});

const productsSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    nombre: { 
        type: String, 
        required: true 
    },
    tipo: { 
        type: String, 
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true 
    },
    desc: { 
        type: String, 
        required: true 
    },
    color: [colorSchema]
});
productsSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;