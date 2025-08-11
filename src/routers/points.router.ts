import { Router } from "express";
import * as pointsController from "../controllers/points.controller";

const router = Router();

router.post("/redeem", pointsController.redeemPointsController);

export default router;
