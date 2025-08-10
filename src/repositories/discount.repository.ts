import prisma from "../lib/prisma";

export const createDiscount = (data: {
  userId: string;
  percentage: number;
  expiredAt: Date;
}) => {
  return prisma.discount.create({ data });
};

export const findValidDiscountsForUser = (userId: string) => {
  return prisma.discount.findMany({
    where: {
      userId,
      expiredAt: { gte: new Date() },
      isUsed: false,
    },
    orderBy: { expiredAt: "asc" },
  });
};

export const markDiscountUsed = (id: string, tx?: any) => {
  const client = tx ?? prisma;
  return client.discount.update({
    where: { id },
    data: { isUsed: true },
  });
};
