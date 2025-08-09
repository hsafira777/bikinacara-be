import { Router } from "express";
import { getOrganizerDashboard } from "../controllers/dashboard.controller";
import {
  verifyToken,
  organizerGuard,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/organizer", verifyToken, organizerGuard, getOrganizerDashboard);

export default router;
