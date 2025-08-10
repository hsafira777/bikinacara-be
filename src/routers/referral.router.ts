import { Router } from "express";
import * as referralController from "../controllers/referral.controller";
const router = Router();

router.post("/apply", referralController.applyReferralController);

export default router;
