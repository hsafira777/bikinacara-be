import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAttendeeStatistics = async (req: Request, res: Response) => {
  try {
    const attendeeId = req.user?.id;
    if (!attendeeId) {
      return res.status(401).json({ message: "Gagal" });
    }

    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: attendeeId,
        paymentStatus: "PAID", 
      },
      include: {
        ticketPurchases: true,
      },
    });

    // event all
    const eventIds = new Set(transactions.map((tx) => tx.eventId));
    const totalEvents = eventIds.size;

    // tiket semua transaksi
    const totalTickets = transactions.reduce((sum, tx) => {
      const ticketsInTransaction = tx.ticketPurchases.reduce(
        (tSum, p) => tSum + p.quantity,
        0
      );
      return sum + ticketsInTransaction;
    }, 0);

    // uang dibelanjakan
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.finalPrice, 0);
    // jumlah transaksi
    const transactionsCount = transactions.length;


    return res.json({
      totalEvents,
      totalTickets,
      totalSpent,
      transactionsCount,
    });
  } catch (error: any) {
    console.error("Attendee stat error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
