import { Request, Response } from "express";
import { getFilteredEvents } from "../services/event.service";

export const getFilteredEventsHandler = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (!type || typeof type !== "string") {
      return res.status(400).json({ message: "Invalid or missing 'type' query parameter" });
    }

    const events = await getFilteredEvents(type);
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching filtered events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
