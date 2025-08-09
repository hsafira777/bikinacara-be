import type { Prisma } from "@prisma/client";

export const createTransaction = (
  tx: Prisma.TransactionClient,
  data: Prisma.TransactionCreateInput
) => {
  return tx.transaction.create({
    data,
    include: {
      items: true,
      ticketPurchases: true,
    },
  });
};

export const updateTicketQuota = (
  tx: Prisma.TransactionClient,
  ticketTypeId: string,
  quantity: number
) => {
  return tx.ticketType.update({
    where: { id: ticketTypeId },
    data: { quota: { decrement: quantity } },
  });
};

export const findTicketTypeById = (
  tx: Prisma.TransactionClient,
  id: string
) => {
  return tx.ticketType.findUniqueOrThrow({
    where: { id },
  });
};

export const createTicketPurchase = (
  tx: Prisma.TransactionClient,
  data: Prisma.TicketPurchaseCreateInput
) => {
  return tx.ticketPurchase.create({
    data,
  });
};

export const redeemPoints = (
  tx: Prisma.TransactionClient,
  pointIds: string[],
  transactionId: string
) => {
  return tx.point.updateMany({
    where: { id: { in: pointIds } },
    data: { redeemed: true, usedInTransactionId: transactionId },
  });
};
