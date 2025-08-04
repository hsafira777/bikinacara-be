import { Router } from "express";
import { createTransactionController } from "../controllers/transaction.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createTransactionController);

export default router;
