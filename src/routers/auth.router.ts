import { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/auth.controller";

const router = Router();

// Login
router.post("/login", loginUser);

// Register
router.post("/register", registerNewUser);

export default router;
