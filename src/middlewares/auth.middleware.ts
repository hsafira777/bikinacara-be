import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "YUKbikinacaraCOY!";


declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

// Middleware utama: token JWT
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized");


    const verifyToken = jwt.verify(token, JWT_SECRET) as IJwtPayload;
    
    if (!verifyToken) throw new Error("Invalid token");

    req.user = verifyToken;
    next();
  } catch (error) {
    next(error); 
  }
}

// Middleware khusus role: Organizer
export function organizerGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "ORGANIZER") {
      throw new Error("Forbidden: Organizer only");
    }
    next();
  } catch (error) {
    next(error);
  }
}

// Middleware khusus role: Attendee
export function attendeeGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.role !== "ATTENDEE") {
      throw new Error("Forbidden: Attendee only");
    }
    next();
  } catch (error) {
    next(error);
  }
}