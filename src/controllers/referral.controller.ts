import { Request, Response } from "express";
import * as referralService from "../services/referral.service";

export const applyReferralController = async (req: Request, res: Response) => {
  try {
    const { referredUserId, referralCode } = req.body;
    if (!referredUserId || !referralCode)
      return res.status(400).json({ error: "Missing data" });
    const result = await referralService.applyReferralOnRegister(
      referredUserId,
      referralCode
    );
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
