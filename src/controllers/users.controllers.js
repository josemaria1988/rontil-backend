import UserService from "../services/users.services.js";
import { isValidPassword } from "../utils.js";

class GetCurrentUserDTO {
  constructor (user) {
    this.name = user.first_name;
    this.role = user.role;
    this.cart = user.cart.length;
  }
}

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  registerUser = async (req, res, next) => {
    try {
      const userResponse = await this.userService.createUser(req.user);
      if (userResponse.status !== "success") {
        throw new Error(userResponse.message);
      }
      next();
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  };

  generateTokenAfterRegister = async (req, res) => {
    const token = this.userService.generateJwtUser(req.user);
    res.cookie('jwtCookie', token, { httpOnly: true });
    res.status(200).json({ status: "success", message: "user registered", token: token });
  };

  loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await this.userService.getUserByEmail(email);

    if (!user) return res.status(401).send({ status: "error", error: "User does not exist" });
    if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Invalid credentials" });

    const token = this.userService.generateJwtUser(user);

    return res.cookie("jwtCookie", token, { httpOnly: true }).send({
      status: "success",
      message: "Login successful",
    });
  };

  restoreUserPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await this.userService.updateUserPassword(email, password);

      return res.send({
        status: response.status,
        message: response.status === "success" ? "successfully updated password" : response.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  logoutUser = (req, res) => {
    res.clearCookie("jwtCookie").send({ status: "success", message: "log out successful" })
  };

  generateTokenAfterGithubLogin = async (req, res) => {
    const token = this.userService.generateJwtUser(req.user);
    res.cookie('jwtCookie', token, { httpOnly: true });
    res.redirect('/');
  };

  generateTokenAfterGoogleLogin = async (req, res) => {
    const token = this.userService.generateJwtUser(req.user);
    res.cookie('jwtCookie', token, { httpOnly: true });
    res.redirect('/');
  };

  getCurrentUser = async (req, res) => {
    const user = req.user;
    const userDTO = new GetCurrentUserDTO(user)
    res.json(userDTO);
  };

  changeUserRole = async (req, res) => {
    try {
      const userId = req.params.uid;
      const response = await this.userService.changeUserRole(userId);
  
      if (response.status === 'success') {
        res.status(200).json({ message: 'Role changed successfully.' });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

}

export default UserController;