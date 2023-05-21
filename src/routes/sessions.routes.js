import { Router } from 'express';
import passport from "passport";
import UserController from '../controllers/users.controllers.js';

const router = Router();
const userController = new UserController();

router.post("/register", passport.authenticate("register", { session: false, failureRedirect: "/failRegister" }), userController.registerUser, userController.generateTokenAfterRegister);
router.post("/login", userController.loginUser);
router.put("/restore", userController.restoreUserPassword);
router.get("/logout", userController.logoutUser);
router.get("/githubcallback", passport.authenticate('githublogin', { failureRedirect: '/login', session: false }), userController.generateTokenAfterGithubLogin);
router.get("/googlecallback", passport.authenticate('googlelogin', { failureRedirect: '/login', session: false }), userController.generateTokenAfterGoogleLogin);

export default router;