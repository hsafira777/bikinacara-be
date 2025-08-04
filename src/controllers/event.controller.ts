import { Request, Response } from "express";
import * as eventRepo from "../repositories/event.repository";

export const createEventController = async (req: Request, res: Response) => {
  const event = await eventRepo.createEvent({ ...req.body });
  res.status(201).json(event);
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
