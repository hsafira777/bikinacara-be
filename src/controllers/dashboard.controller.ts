import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getOrganizerDashboard = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;

    if (!organizerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get all events organized by this user
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        tickets: {
          select: { id: true, price: true, purchases: true },
        },
        transactions: true,
        reviews: true,
      },
    });

    const formattedEvents = events.map((event) => {
      const totalParticipants = event.tickets.reduce((sum, ticket) => {
        return sum + ticket.purchases.reduce((q, p) => q + p.quantity, 0);
      }, 0);

      const totalRevenue = event.transactions.reduce(
        (sum, tx) => sum + tx.finalPrice,
        0
      );

      return {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        totalParticipants,
        totalRevenue,
        reviewCount: event.reviews.length,
      };
    });

    res.json({
      message: "Organizer dashboard data",
      data: formattedEvents,
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
