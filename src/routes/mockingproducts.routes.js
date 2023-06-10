import { Router } from "express";
import MockingController from "../controllers/mocking.controller.js";

const mockingController = new MockingController();

const router = Router();

router.get('/', mockingController.showMocking);

export default router;