import userRepository from "../dao/repositories/users.repository.js";

class UserService {


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
            const existingUser = await userRepository.find({ email });
            if (existingUser) {
                throw new Error("El correo electrónico ya está en uso");
            }

            const newUser = new userRepository({
                first_name,
                email,
                password
            });

            const savedUser = await newUser.save();
            return { status: "success", user: savedUser };
        } catch (error) {
            console.error(error);
            return { status: "fail", message: "No se pudo crear el usuario en la base de datos" }
        }
    }
}

export default UserService;