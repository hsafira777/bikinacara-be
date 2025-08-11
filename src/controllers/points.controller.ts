import { Request, Response } from "express";
import * as pointsService from "../services/points.service";

export const redeemPointsController = async (req: Request, res: Response) => {
  try {
    const { userId, amount, transactionId } = req.body;
    if (!userId || !amount || !transactionId) {
      return res
        .status(400)
        .json({ error: "userId, amount and transactionId required" });
    }
    const result = await pointsService.redeemPointsForTransaction(
      userId,
      amount,
      transactionId
    );
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
