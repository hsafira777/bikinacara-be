import prisma from "../lib/prisma";
import * as discountRepo from "../repositories/discount.repository";

export const listValidDiscounts = async (userId: string) => {
  return discountRepo.findValidDiscountsForUser(userId);
};


export const computeDiscountForUser = async (
  userId: string,
  ticketPrice: number
) => {
  const discounts = await discountRepo.findValidDiscountsForUser(userId);
  if (!discounts || discounts.length === 0) {
    return { discountAmount: 0, discountRecord: null, finalPrice: ticketPrice };
  }

 
  const best = discounts.reduce((a, b) =>
    a.percentage >= b.percentage ? a : b
  );
  const discountAmount = Math.floor((ticketPrice * best.percentage) / 100);
  const finalPrice = Math.max(ticketPrice - discountAmount, 0);
  return { discountAmount, discountRecord: best, finalPrice };
};
