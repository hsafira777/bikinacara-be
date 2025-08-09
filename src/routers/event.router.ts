import { Router } from "express";
import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getFilteredEventsController,
} from "../controllers/event.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { organizerGuard } from "../middlewares/auth.middleware";
const router = Router();

router.get("/filter", getFilteredEventsController);
router.get("/", getAllEventsController);
router.get("/:id", getEventByIdController);
router.post("/", verifyToken,organizerGuard, upload.single("image"), createEventController);
router.put("/:id", verifyToken, organizerGuard, updateEventController);
router.delete("/:id", verifyToken, organizerGuard, deleteEventController);

export default router;