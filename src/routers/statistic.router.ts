import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getYearlyStatistics } from "../controllers/statistic.controller";
import { getMonthlyStatistics } from "../controllers/statistic.controller";
import { getEventTypesStats } from "../controllers/statistic.controller";
import { getDailyStatistics } from "../controllers/statistic.controller";
import { organizerGuard } from "../middlewares/auth.middleware";



const router = Router();
router.use  (verifyToken, organizerGuard);

router.get("/yearly", getYearlyStatistics);
router.get("/monthly", getMonthlyStatistics);
router.get("/daily", getDailyStatistics);
router.get("/type-event", getEventTypesStats);


export default router;
