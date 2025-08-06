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
  const ticketType = await prisma.ticketType.findUniqueOrThrow({
    where: { id: ticketTypeId },
  });

  const basePrice = ticketType.price * quantity;
  let discount = 0;
  let pointsUsed = 0;
  let finalPrice = basePrice;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      referralsUsed: true,
      points: {
        where: {
          redeemed: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "asc" }, // FIFO
      },
    },
  });

  //  Check if referral-based discount still valid (10%)
  const referral = user.referralsUsed[0];
  if (referral && dayjs(referral.createdAt).add(3, "month").isAfter(dayjs())) {
    discount = Math.floor(0.1 * basePrice);
    finalPrice -= discount;
  }

  // Apply point balance
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

    // Update point status
    for (const { id, usedAmount } of pointUpdates) {
      await prisma.point.update({
        where: { id },
        data: {
          redeemed: true,
          usedInTransactionId: undefined, // kita isi nanti
        },
      });
    }

    pointsUsed = pointTotal;
    finalPrice -= pointsUsed;
  }

  // Save transaction
  const transaction = await prisma.transaction.create({
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
  await prisma.ticketPurchase.create({
    data: {
      attendeeId: userId,
      transactionId: transaction.id,
      ticketTypeId,
      quantity,
    },
  });

  // Update points with usedInTransactionId
  await prisma.point.updateMany({
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
};
