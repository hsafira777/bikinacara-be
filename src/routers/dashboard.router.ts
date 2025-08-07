import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getOrganizerDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get("/organizer", verifyToken, getOrganizerDashboard);

export default router;
