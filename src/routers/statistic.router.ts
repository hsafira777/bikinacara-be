import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getYearlyStatistics } from "../controllers/statistic.controller";
import { getMonthlyStatistics } from "../controllers/statistic.controller";

const router = Router();

router.get("/yearly", verifyToken, getYearlyStatistics);
router.get("/monthly", verifyToken, getMonthlyStatistics);

export default router;
