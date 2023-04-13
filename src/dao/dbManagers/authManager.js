import UserManager from "./userManager.js";

const userManager = new UserManager();

class AuthManager {

    loginUser = async (email, password) => {
        try {
            const user = await userManager.getUserByEmail(email);
            if(!user) {
                return {status: "error", message: "Correo electrónico o contraseña incorrectos"};
            }

            if (password == user.password) {
                return {status: "Success", user};
            } else {
                return {status: "error", message: "Correo electrónico o contraseña incorrectos"};
            }
        } catch (error) {
            console.error(error);
            return { status: "error", message: "Error al iniciar sesión"};
        }
    };

    logoutUser = (req, res) => {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).send({status: "error", message: "Error al cerrar sesión"})
            }
            res.clearCookie("connect.sid");
            res.send({status: "success", message: "Sesión finalizada con éxito"});
        })
    }
}

export default AuthManager;