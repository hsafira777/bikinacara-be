import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getAttendeeStatistics } from "../controllers/attendee.controller";

const router = Router();
router.get("/attendee", verifyToken, getAttendeeStatistics);

export default router;
