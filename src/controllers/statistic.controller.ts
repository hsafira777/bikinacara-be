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

    res.json({
      year,
      month,
    });
  } catch (error: any) {
    console.error("Monthly stats error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getDailyStatistics = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) return res.status(401).json({ message: "Unauthorized" });

    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string);
    const day = parseInt(req.query.day as string);

    if (!month || !day) {
      return res
        .status(400)
        .json({ message: "Month and day are required (1-12, 1-31)" });
    }

    const startDate = new Date(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}T00:00:00`
    );
    const endDate = dayjs(startDate).endOf("day").toDate();

    const events = await prisma.event.findMany({
      where: {
        organizerId,
        date: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        title: true,
        transactions: {
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
          select: { finalPrice: true },
        },
        tickets: {
          select: {
            purchases: {
              where: { createdAt: { gte: startDate, lte: endDate } },
              select: { quantity: true },
            },
          },
        },
      },
    });

    const dailyStats = events.map((event) => {
      const totalRevenue = event.transactions.reduce(
        (sum, t) => sum + t.finalPrice,
        0
      );
      const totalParticipants = event.tickets.reduce((sum, t) => {
        return sum + t.purchases.reduce((q, p) => q + p.quantity, 0);
      }, 0);

      return {
        eventId: event.id,
        title: event.title,
        totalRevenue,
        totalParticipants,
      };
    });

    return res.json({ date: startDate, data: dailyStats });
  } catch (err: any) {
    console.error("Daily stats error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getEventTypesStats = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) return res.status(401).json({ message: "Unauthorized" });

    const result = await prisma.event.groupBy({
      by: ["eventCategory"],
      where: { organizerId },
      _count: true,
    });

    const data = result.map((item) => ({
      name: item.eventCategory,
      count: item._count,
    }));

    res.json(data);
  } catch (error: any) {
    console.error("Event types stats error:", error);
    res.status(500).json({ message: error.message });
  }
};