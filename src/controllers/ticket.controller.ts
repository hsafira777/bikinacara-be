import { Request, Response } from "express";
import * as ticketRepo from "../repositories/ticket.repository";

export const createTicketEventController = async (
  req: Request,
  res: Response
) => {
  try {
    const { tickets } = req.body;
    const { eventId } = req.params;

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
