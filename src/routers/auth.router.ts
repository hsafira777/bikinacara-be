import { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/auth.controller";

const router = Router();


router.post("/login", loginUser);
router.post("/register", registerNewUser);

export default router;
