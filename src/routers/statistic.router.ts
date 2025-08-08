import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getYearlyStatistics } from "../controllers/statistic.controller";
import { getMonthlyStatistics } from "../controllers/statistic.controller";
import { getEventTypesStats } from "../controllers/statistic.controller";
import { getDailyStatistics } from "../controllers/statistic.controller";



const router = Router();

router.get("/yearly", verifyToken, getYearlyStatistics);
router.get("/monthly", verifyToken, getMonthlyStatistics);
router.get("/daily", verifyToken, getDailyStatistics);
router.get("/type-event", verifyToken, getEventTypesStats);


export default router;
