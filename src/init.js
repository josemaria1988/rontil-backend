import User from "./dao/models/user.model.js";
import bcrypt from "bcrypt";

const createAdminUser = async () => {
  try {
    const existingUser = await User.findOne({ email: "adminCoder@coder.com" });
    if (existingUser) {
      console.log("El usuario administrador ya existe");
      return;
    }

    const passwordHash = await bcrypt.hash("adminCod3r123", 10);

    const newUser = new User({
      email: "adminCoder@coder.com",
      password: passwordHash,
      displayName: "CoderHouse",
      role: "admin"
    });

    await newUser.save();
    console.log("Usuario administrador creado con éxito");
  } catch (err) {
    console.error("Error al crear el usuario administrador:", err);
  }
};

export default createAdminUser;