import prisma from "../lib/prisma";

export const createPromotion = async (data: {
  eventId: string;
  type: "VOUCHER" | "REFERRAL" | "POINTS_REDEMPTION";
  value: number;
  valueType: "PERCENTAGE" | "FIXED";
  usageLimit: number;
  startDate: Date | string;
  endDate: Date | string;
  voucherCode?: string;
}) => {
  return prisma.promotion.create({
    data: {
      eventId: data.eventId,
      type: data.type,
      value: data.value,
      valueType: data.valueType,
      usageLimit: data.usageLimit,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      voucherCode: data.voucherCode,
    },
  });
};