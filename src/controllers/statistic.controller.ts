import { Request, Response } from "express";
import prisma from "../lib/prisma";
import dayjs from "dayjs";

export const getYearlyStatistics = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) return res.status(401).json({ message: "Unauthorized" });

    const currentYear = new Date().getFullYear();

    // Event organizer tahun ini
    const events = await prisma.event.findMany({
      where: {
        organizerId,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      select: {
        id: true,
        date: true,
        transactions: {
          select: {
            finalPrice: true,
            createdAt: true,
          },
        },
        tickets: {
          select: {
            purchases: {
              select: {
                quantity: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalParticipants: 0,
      totalRevenue: 0,
      totalEvents: 0,
    }));

    for (const event of events) {
      const eventMonth = new Date(event.date).getMonth(); // 0-indexed
      monthlyStats[eventMonth].totalEvents++;

      // Revenue per bulan
      for (const tx of event.transactions) {
        const txMonth = new Date(tx.createdAt).getMonth();
        monthlyStats[txMonth].totalRevenue += tx.finalPrice;
      }

      // Peserta per bulan
      for (const ticket of event.tickets) {
        for (const purchase of ticket.purchases) {
          const purMonth = new Date(purchase.createdAt).getMonth();
          monthlyStats[purMonth].totalParticipants += purchase.quantity;
        }
      }
    }

    res.json({
      year: currentYear,
      data: monthlyStats,
    });
  } catch (error: any) {
    console.error("Yearly stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


export const getMonthlyStatistics = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) return res.status(401).json({ message: "Unauthorized" });

    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string); // 1-12
    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
    const endDate = dayjs(startDate).endOf("month").toDate();

    // Event yang dibuat bulan itu
    const events = await prisma.event.findMany({
      where: {
        organizerId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        transactions: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            finalPrice: true,
            createdAt: true,
          },
        },
        tickets: {
          select: {
            purchases: {
              where: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              select: {
                quantity: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // Statistik harian
    const daysInMonth = dayjs(startDate).daysInMonth();
    const dailyStats = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      totalParticipants: 0,
      totalRevenue: 0,
      totalEvents: 0,
    }));

    for (const event of events) {
      const eventDay = new Date(event.date).getDate() - 1;
      dailyStats[eventDay].totalEvents++;

      for (const tx of event.transactions) {
        const day = new Date(tx.createdAt).getDate() - 1;
        dailyStats[day].totalRevenue += tx.finalPrice;
      }

      for (const ticket of event.tickets) {
        for (const purchase of ticket.purchases) {
          const day = new Date(purchase.createdAt).getDate() - 1;
          dailyStats[day].totalParticipants += purchase.quantity;
        }
      }
    }

    res.json({
      year,
      month,
      data: dailyStats,
    });
  } catch (error: any) {
    console.error("Monthly stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// Statistik Buat Attende
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