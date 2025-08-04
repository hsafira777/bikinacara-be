
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const REFERRAL_POINT = 10000;
const REFERRAL_DISCOUNT_PERCENTAGE = 10;
const REFERRAL_EXPIRY_MONTHS = 3;

export const applyReferralOnRegister = async (
  referredUserId: string,
  referralCode: string
) => {
  const referrer = await prisma.user.findFirst({
    where: { referralCode },
  });

  if (!referrer) throw new Error("Referral code not found");

  // Save referral relation
  await prisma.referral.create({
    data: {
      usedById: referrer.id,
      referredUserId,
      referralCodeUsed: referralCode,
    },
  });

  // Generate points for referrer
  await prisma.point.create({
    data: {
      userId: referrer.id,
      amount: REFERRAL_POINT,
      source: "REFERRAL",
      expiresAt: dayjs().add(REFERRAL_EXPIRY_MONTHS, "month").toDate(),
    },
  });

  // Update pointsBalance
  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      pointsBalance: {
        increment: REFERRAL_POINT,
      },
    },
  });
};

export const applyPointsAndDiscount = async (
  userId: string,
  ticketPrice: number
): Promise<{
  finalPrice: number;
  usedPoints: number;
  discount: number;
}> => {
  const referrals = await prisma.referral.findMany({
    where: {
      referredUserId: userId,
      createdAt: {
        gte: dayjs().subtract(REFERRAL_EXPIRY_MONTHS, "month").toDate(),
      },
    },
  });

  const isEligibleForReferralDiscount = referrals.length > 0;
  const discount = isEligibleForReferralDiscount
    ? Math.floor((ticketPrice * REFERRAL_DISCOUNT_PERCENTAGE) / 100)
    : 0;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const usedPoints = Math.min(user.pointsBalance, ticketPrice - discount);

  const finalPrice = ticketPrice - discount - usedPoints;

  return {
    finalPrice,
    usedPoints,
    discount,
  };
};

export const redeemPoints = async (
  userId: string,
  amount: number,
  transactionId: string
) => {
  const activePoints = await prisma.point.findMany({
    where: {
      userId,
      redeemed: false,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: { createdAt: "asc" },
  });

  let remaining = amount;
  for (const point of activePoints) {
    if (remaining <= 0) break;

    await prisma.point.update({
      where: { id: point.id },
      data: {
        redeemed: true,
        usedInTransactionId: transactionId,
      },
    });

    remaining -= point.amount;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      pointsBalance: {
        decrement: amount,
      },
    },
  });
};
