import { Router } from "express";
import * as discountController from "../controllers/discount.controller";

const router = Router();

router.get("/:userId", discountController.getValidDiscountsController);
router.post("/preview", discountController.previewCheckoutController); 

export default router;
