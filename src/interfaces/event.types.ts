import { EventCategory, EventType } from "@prisma/client";

export interface IEvent {
  id: string;
  title: string;
  description?: string;
  location: string;
  date: Date;
  organizerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventQuery {
  search?: string;
  category?: EventCategory;
  location?: string;
  eventType?: EventType;
  page?: string;
  limit?: string;
}