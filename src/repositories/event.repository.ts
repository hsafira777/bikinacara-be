import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

// CREATE event
export const createEvent = (data: Prisma.EventCreateInput) => {
  return prisma.event.create({ data });
};

// READ all events
export const getAllEvents = () => {
  return prisma.event.findMany();
};

// READ event by ID
export const getEventById = (id: string) => {
  return prisma.event.findUnique({
    where: { id },
  });
};

// UPDATE event
export const updateEvent = (id: string, data: Prisma.EventUpdateInput) => {
  return prisma.event.update({
    where: { id },
    data,
  });
};

// DELETE event
export const deleteEvent = (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};

// GET filtered events by type
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
