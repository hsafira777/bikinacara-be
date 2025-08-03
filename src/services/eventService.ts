import prisma from "../lib/prisma";

export const getFilteredEvents = async (query: any) => {
  const { search = "", category, location, page = "1", limit = "10" } = query;

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const filters: any = {
    title: {
      contains: search,
      mode: "insensitive",
    },
  };

  if (category) filters.category = category;
  if (location) filters.location = location;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where: filters,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.count({ where: filters }),
  ]);

  return {
    data: events,
    total,
    page: pageNumber,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
