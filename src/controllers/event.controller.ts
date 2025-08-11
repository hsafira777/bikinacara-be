import { Request, Response } from "express";
import * as eventRepo from "../repositories/event.repository";
import { EventQuery } from "../interfaces/event.types";
import * as ticketRepo from "../repositories/ticket.repository";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const event = await eventRepo.createEvent(req.body, req.file);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error });
  }
};

export const createTicketEventController = async (req: Request, res: Response) => {
  try {
    const { eventId, tickets } = req.body;

    if (!eventId || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Invalid ticket data" });
    }

    const result = await ticketRepo.createTicketEvent(eventId, tickets);

    res.status(201).json({
      message: "Ticket types created successfully",
      count: result.count,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllEventsController = async (_req: Request, res: Response) => {
  const events = await eventRepo.getAllEvents();
  res.json(events);
};

export const getEventByIdController = async (req: Request, res: Response) => {
  const event = await eventRepo.getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const updateEventController = async (req: Request, res: Response) => {
  const event = await eventRepo.updateEvent(req.params.id, req.body);
  res.json(event);
};

export const deleteEventController = async (req: Request, res: Response) => {
  await eventRepo.deleteEvent(req.params.id);
  res.status(204).send();
};

export const getUpcomingEventsController = async ( _req: Request, res: Response ) => {
  try {
    const events = await eventRepo.getUpcomingEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getFilteredEventsController = async (
  req: Request<{}, {}, {}, EventQuery>,
  res: Response
) => {
  try {
    const events = await eventRepo.getFilteredEvents(req.query);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching filtered events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
