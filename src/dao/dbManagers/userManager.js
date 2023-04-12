import mongoose from "mongoose";
import userModel from "./user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (first_name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new userModel({
            first_name: first_name,
            email: email,
            password: hashedPassword,
        });
    } catch (error) {
        console.log(error)
    }
}