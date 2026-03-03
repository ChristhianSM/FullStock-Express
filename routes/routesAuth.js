import { Router } from "express";
import * as authController from "../controllers/authController.js";

const router = Router();

// Rutas para autenticación
router.get("/signup", authController.renderSignup);

router.post("/signup", authController.handleSignup);

export default router;
