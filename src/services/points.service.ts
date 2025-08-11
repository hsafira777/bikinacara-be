import prisma from "../lib/prisma";
import * as pointsRepo from "../repositories/points.repository";


export const expireOldPoints = async (
  userId: string,
  tx: typeof prisma["$transaction"] extends never ? any : any
) => {

  const client = tx ?? prisma;

  const expired: { id: string; amount: number }[] = await client.point.findMany({
    where: {
      userId,
      redeemed: false,
      expiresAt: { lt: new Date() },
    },
  });

  if (expired.length === 0) return;

  const ids = expired.map((p) => p.id);
  const totalExpired = expired.reduce((s, p) => s + p.amount, 0);

  await client.point.updateMany({
    where: { id: { in: ids } },
    data: { redeemed: true },
  });

  await client.user.update({
    where: { id: userId },
    data: { pointsBalance: { decrement: totalExpired } },
  });
};


export const redeemPointsForTransaction = async (
  userId: string,
  amount: number,
  transactionId: string
) => {
  if (amount <= 0) throw new Error("Invalid redeem amount");

  return prisma.$transaction(async (tx) => {

    await expireOldPoints(userId, tx);


    const activePoints = await tx.point.findMany({
      where: { userId, redeemed: false, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: "asc" },
    });

    let remaining = amount;
    for (const p of activePoints) {
      if (remaining <= 0) break;
      if (p.amount <= remaining) {
       
        await tx.point.update({
          where: { id: p.id },
          data: { redeemed: true, usedInTransactionId: transactionId },
        });
        remaining -= p.amount;
      } else {
      
        await tx.point.update({
          where: { id: p.id },
          data: { amount: p.amount - remaining },
        });
    
        await tx.point.create({
          data: {
            userId,
            amount: remaining,
            source: p.source,
            usedInTransactionId: transactionId,
            expiresAt: p.expiresAt,
            redeemed: true,
          },
        });
        remaining = 0;
      }
    }

 
    await tx.user.update({
      where: { id: userId },
      data: { pointsBalance: { decrement: amount } },
    });

    return { success: true, redeemedAmount: amount };
  });
};
