import { Request, Response } from "express";
import * as discountService from "../services/discount.service";
import { PointsRepository } from "../repositories/points.repository";

export const getValidDiscountsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    const discounts = await discountService.listValidDiscounts(userId);
    return res.json({ discounts });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};


export const previewCheckoutController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, ticketPrice } = req.body;
    if (!userId || typeof ticketPrice !== "number") {
      return res.status(400).json({ error: "Invalid input" });
    }


    const discountResult = await discountService.computeDiscountForUser(
      userId,
      ticketPrice
    );

    const activePoints = await PointsRepository.findActivePoints(userId);
    const totalPoints = activePoints.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

    const canUsePoints = Math.min(totalPoints, discountResult.finalPrice);
    const finalPriceAfterPoints = discountResult.finalPrice - canUsePoints;

    return res.json({
      ticketPrice,
      discountAmount: discountResult.discountAmount,
      usedPointsSuggest: canUsePoints,
      finalPrice: finalPriceAfterPoints,
      discountRecord: discountResult.discountRecord ?? null,
    });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};
