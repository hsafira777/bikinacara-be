import  prisma  from "../lib/prisma";

export const createTicketEvent = (
  eventId: string,
  tickets: { name: string; price: number; quota: number }[]
) => {
  return prisma.ticketType.createMany({
    data: tickets.map((t) => ({
      ...t,
      eventId,
    })),
  });
};
