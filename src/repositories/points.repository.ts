import prisma from "../lib/prisma";
import { PointSource } from "@prisma/client";

export class PointsRepository {
  static createPoint(data: {
    userId: string;
    amount: number;
    source: PointSource;
    expiresAt: Date;
  }) {
    return prisma.point.create({ data });
  }

  static findActivePoints(userId: string) {
    return prisma.point.findMany({
      where: {
        userId,
        redeemed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static findExpiredUnredeemedPoints(userId: string) {
    return prisma.point.findMany({
      where: {
        userId,
        redeemed: false,
        expiresAt: { lt: new Date() },
      },
    });
  }

  static markPointsRedeemedByIds(ids: string[], tx?: any) {
    const client = tx ?? prisma;
    return client.point.updateMany({
      where: { id: { in: ids } },
      data: { redeemed: true },
    });
  }

  static updatePointAmount(id: string, newAmount: number, tx?: any) {
    const client = tx ?? prisma;
    return client.point.update({
      where: { id },
      data: { amount: newAmount },
    });
  }
}
