import prisma from "../lib/prisma";
import * as pointsRepo from "../repositories/points.repository";

/**
 * Expire old points: mark redeemed true and decrement user's pointsBalance
 * This function accepts a Prisma TransactionClient to be used inside transactions.
 */
export const expireOldPoints = async (
  userId: string,
  tx: typeof prisma["$transaction"] extends never ? any : any
) => {
  // We'll call with tx inside $transaction; but allow direct prisma too.
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

/**
 * Redeem specific amount of points for a user (atomic)
 * - marks point rows as redeemed (or reduces amount)
 * - decrements user's pointsBalance
 */
export const redeemPointsForTransaction = async (
  userId: string,
  amount: number,
  transactionId: string
) => {
  if (amount <= 0) throw new Error("Invalid redeem amount");

  return prisma.$transaction(async (tx) => {
    // expire old points first
    await expireOldPoints(userId, tx);

    // get active points
    const activePoints = await tx.point.findMany({
      where: { userId, redeemed: false, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: "asc" },
    });

    let remaining = amount;
    for (const p of activePoints) {
      if (remaining <= 0) break;
      if (p.amount <= remaining) {
        // consume full point
        await tx.point.update({
          where: { id: p.id },
          data: { redeemed: true, usedInTransactionId: transactionId },
        });
        remaining -= p.amount;
      } else {
        // partially consume point by decreasing its amount and create redeemed record for used part
        // Option A: reduce amount on original record
        await tx.point.update({
          where: { id: p.id },
          data: { amount: p.amount - remaining },
        });
        // create a redeemed record representing consumed portion (optional)
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

    // decrement user's pointsBalance by requested amount
    await tx.user.update({
      where: { id: userId },
      data: { pointsBalance: { decrement: amount } },
    });

    return { success: true, redeemedAmount: amount };
  });
};
