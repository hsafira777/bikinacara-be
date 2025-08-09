import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";

export const createTransactionController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id; // dari middleware verifyToken
    const { eventId, ticketTypeId, quantity, usePoints } = req.body;

    if (!userId || !eventId || !ticketTypeId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await transactionService.createTransaction({
      userId,
      eventId,
      ticketTypeId,
      quantity,
      usePoints: usePoints ?? false,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error: any) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};