import { Router } from 'express';
import passport from "passport";
import UserController from '../controllers/users.controllers.js';
import { isAuthenticated, isAdmin } from '../utils.js';

const router = Router();
const userController = new UserController();

router.post("/register", passport.authenticate("register", { session: false, failureRedirect: "/failRegister" }), userController.registerUser, userController.generateTokenAfterRegister);
router.post("/login", userController.loginUser);
router.get("/current", isAuthenticated, userController.getCurrentUser);
router.put("/restore", userController.restoreUserPassword);
router.get("/logout", userController.logoutUser);
router.get('/google', passport.authenticate('googlelogin', { scope: ['profile', 'email'] }));
router.get('/github', passport.authenticate('githublogin'));
router.get("/githubcallback", passport.authenticate('githublogin', { failureRedirect: '/login', session: false }), userController.generateTokenAfterGithubLogin);
router.get("/googlecallback", passport.authenticate('googlelogin', { failureRedirect: '/login', session: false }), userController.generateTokenAfterGoogleLogin);
router.patch('/premium/:uid', isAdmin, userController.changeUserRole);

export default router;