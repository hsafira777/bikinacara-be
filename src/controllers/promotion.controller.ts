import { Request, Response } from "express";
import * as promoRepo from "../repositories/promotion.repository";

export const createPromotionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    const promotionData = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const result = await promoRepo.createPromotion({
      ...promotionData,
      eventId,
    });

    res.status(201).json({
      message: "Promotion created successfully",
      promotion: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
