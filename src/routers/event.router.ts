import { Router } from "express";
import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "../controllers/event.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllEventsController);
router.get("/:id", getEventByIdController);
router.post("/", verifyToken, createEventController);
router.put("/:id", verifyToken, updateEventController);
router.delete("/:id", verifyToken, deleteEventController);

export default router;
