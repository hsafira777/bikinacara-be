import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

interface CreateTransactionParams {
  userId: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  usePoints?: boolean;
}

export const createTransaction = async ({
  userId,
  eventId,
  ticketTypeId,
  quantity,
  usePoints = false,
}: CreateTransactionParams) => {
  return prisma.$transaction(async (tx) => {
    const ticketType = await tx.ticketType.findUniqueOrThrow({
      where: { id: ticketTypeId },
    });

    const basePrice = ticketType.price * quantity;
    let discount = 0;
    let pointsUsed = 0;
    let finalPrice = basePrice;

    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        referralsUsed: true,
        points: {
          where: {
            redeemed: false,
            expiresAt: { gte: new Date() },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Referral discount (10%)
    const referral = user.referralsUsed[0];
    if (
      referral &&
      dayjs(referral.createdAt).add(3, "month").isAfter(dayjs())
    ) {
      discount = Math.floor(0.1 * basePrice);
      finalPrice -= discount;
    }

    // Apply points
    if (usePoints && user.points.length > 0) {
      let pointTotal = 0;
      const pointUpdates: { id: string; usedAmount: number }[] = [];

      for (const p of user.points) {
        if (p.redeemed) continue;
        const canUse = Math.min(p.amount, finalPrice - pointTotal);
        if (canUse > 0) {
          pointUpdates.push({ id: p.id, usedAmount: canUse });
          pointTotal += canUse;
          if (pointTotal >= finalPrice) break;
        }
      }

      // Update point status (mark redeemed)
      for (const { id } of pointUpdates) {
        await tx.point.update({
          where: { id },
          data: {
            redeemed: true,
            usedInTransactionId: undefined, // isi nanti
          },
        });
      }

      pointsUsed = pointTotal;
      finalPrice -= pointsUsed;
    }

    // Save transaction
    const transaction = await tx.transaction.create({
      data: {
        userId,
        eventId,
        totalPrice: basePrice,
        appliedDiscount: discount,
        usedPoints: pointsUsed,
        finalPrice,
        paymentStatus: "PENDING",
        items: {
          create: {
            ticketTypeId,
            quantity,
            subtotal: basePrice,
          },
        },
      },
    });

    // Save ticket purchase
    await tx.ticketPurchase.create({
      data: {
        attendeeId: userId,
        transactionId: transaction.id,
        ticketTypeId,
        quantity,
      },
    });

    // Update points to link with transactionId
    await tx.point.updateMany({
      where: {
        userId,
        redeemed: true,
        usedInTransactionId: null,
      },
      data: {
        usedInTransactionId: transaction.id,
      },
    });


    return transaction;
  });
};
