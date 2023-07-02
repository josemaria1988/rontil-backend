import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
});

export default usersSchema;