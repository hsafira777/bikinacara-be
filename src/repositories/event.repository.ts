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
