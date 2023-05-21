import mongoose from "mongoose";
import usersSchema from '../schemas/user.schema.js';

const usersCollection = "users";
const usersRepository = mongoose.model(usersCollection, usersSchema);

export default usersRepository;