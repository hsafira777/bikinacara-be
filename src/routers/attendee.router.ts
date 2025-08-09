import { Router } from "express";
import { getAttendeeStatistics } from "../controllers/attendee.controller";
import {
  verifyToken,
  attendeeGuard,
} from "../middlewares/auth.middleware";

const router = Router();
router.get("/", verifyToken, attendeeGuard, getAttendeeStatistics);

export default router;
