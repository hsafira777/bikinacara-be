import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getOrganizerDashboard } from "../controllers/dashboard.controller";

const router = Router();

// Only ORGANIZER can access
router.get("/organizer", verifyToken, getOrganizerDashboard);

export default router;
