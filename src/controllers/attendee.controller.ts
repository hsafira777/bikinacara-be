import { Request, Response } from "express";
import prisma from "../lib/prisma";
export const getAttendeeStatistics = async (req: Request, res: Response) => {
  try {
    const attendeeId = req.user?.id;
    if (!attendeeId) return res.status(401).json({ message: "Unauthorized" });

    const transactions = await prisma.transaction.findMany({
      where: { userId: attendeeId },
      include: {
        ticketPurchases: true,
      },
    });

    const totalEvents = new Set(transactions.map((tx) => tx.eventId)).size;
    const totalTickets = transactions.reduce((sum, tx) => {
      return sum + tx.ticketPurchases.reduce((s, p) => s + p.quantity, 0);
    }, 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.finalPrice, 0);

    res.json({
      totalEvents,
      totalTickets,
      totalSpent,
      transactionsCount: transactions.length,
    });
  } catch (error: any) {
    console.error("Attendee stat error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
