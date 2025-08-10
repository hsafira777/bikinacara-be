import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import prisma from "../lib/prisma";

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

export const getTransactionByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        event: true,
        items: {
          include: {
            ticketType: true,
          },
        },
        // atau kalau mau include ticketPurchases juga
        ticketPurchases: {
          include: {
            ticketType: true,
            attendee: true, // misal kamu mau info attendee juga
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error: any) {
    console.error("Get Transaction Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};