import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: Boolean, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    thumbnails: { 
        type: Array 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: "admin"
      }
});
productsSchema.plugin(mongoosePaginate);

export default productsSchema;