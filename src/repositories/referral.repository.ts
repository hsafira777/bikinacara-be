import prisma from "../lib/prisma";

export const findUserByReferralCode = (code: string) => {
  return prisma.user.findFirst({ where: { referralCode: code } });
};

export const createReferral = (data: {
  usedById: string;
  referredUserId: string;
  referralCodeUsed: string;
}) => {
  return prisma.referral.create({ data });
};

export const findRecentReferralForReferredUser = (
  referredUserId: string,
  since: Date
) => {
  return prisma.referral.findMany({
    where: {
      referredUserId,
      createdAt: { gte: since },
    },
  });
};
