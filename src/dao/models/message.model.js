import mongoose from "mongoose";
import userModel from "./user.model.js";

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: true,
    },
    name: {
        type: String,
        required: true,
      },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Message = mongoose.model("Message", messageSchema);

export default Message;