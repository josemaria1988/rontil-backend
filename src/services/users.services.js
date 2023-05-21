import userRepository from "../dao/repositories/users.repository.js";
import jwt from 'jsonwebtoken';
import config from "../config.js";

class UserService {
    generateJwtUser = (user) => {
        const { _id, first_name, last_name, cart, email, role } = user;
        const payload = { _id, name: `${first_name} ${last_name}`, cart, email, role };
        try {
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
            return token;
        } catch (err) {
            console.error(err);
        }
    };

    getUserByEmail = async (email) => {
        try {
            const user = await userRepository.findOne({ email: email });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    createUser = async (first_name, email, password) => {
        try {
            const existingUser = await userRepository.findOne({ email });
            if (existingUser) {
                throw new Error("El correo electrónico ya está en uso");
            }

            const newUser = new userRepository({
                first_name,
                last_name,
                email,
                age,
                password,
                role
            });

            // Crear carrito vacío para el usuario
            await this.cartManager.createEmptyCart(savedUser._id);

            const savedUser = await newUser.save();
            return { status: "success", user: savedUser };
        } catch (error) {
            console.error(error);
            return { status: "fail", message: "No se pudo crear el usuario en la base de datos" }
        }
    }

    updateUserPassword = async (email, password) => {
        try {
            const user = await userRepository.findOne({ email });
            if (!user) {
                throw new Error("Usuario no encontrado");
            }

            const hashedPassword = createHash(password);
            const updatedUser = await userRepository.updateOne({ email }, { password: hashedPassword });

            return { status: "success", user: updatedUser };
        } catch (error) {
            console.error(error);
            return { status: "fail", message: "No se pudo actualizar la contraseña del usuario" }
        }
    }
}

export default UserService;