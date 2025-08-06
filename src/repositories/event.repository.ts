import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import { EventCategory, EventType, Prisma } from "@prisma/client";
import { EventQuery } from "../interfaces/event.types";
import { Express } from "express";

// CREATE event
export const createEvent = async (
  data: {
    title: string;
    description: string;
    date: Date | string;
    time: Date | string;
    location: string;
    eventCategory: EventCategory;
    eventType: EventType;
    totalSeats: number;
    organizerId: string;
  },
  file?: Express.Multer.File
) => {
  let imageUrl: string | undefined;

  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "event_images",
    });
    imageUrl = result.secure_url;
  }

  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      eventCategory: data.eventCategory,
      eventType: data.eventType,
      totalSeats: Number(data.totalSeats),
      organizer: {
        connect: { id: data.organizerId },
      },
      image: imageUrl,
    },
  });
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

// GET Upcoming Events
export const getUpcomingEvents = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return prisma.event.findMany({
    where: {
      date: {
        gte: todayStart,
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};

// GET filtered events by category
export const getFilteredEvents = async (query: EventQuery) => {
  const {
    search = "",
    category,
    location,
    eventType,
    page = "1",
    limit = "10",
  } = query;

  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const filters: Prisma.EventWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category &&
      Object.values(EventCategory).includes(category as EventCategory) && {
        eventCategory: category as EventCategory,
      }),
    ...(location && { location }),
    ...(eventType &&
      Object.values(EventType).includes(eventType as EventType) && {
        eventType: eventType as EventType,
      }),
  };

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
