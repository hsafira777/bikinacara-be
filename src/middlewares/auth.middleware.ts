import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth.types";

// Gunakan kunci dari env atau fallback sementara
const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// Extend global Express Request agar punya req.user dengan tipe IJwtPayload
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

// Middleware utama: verifikasi token JWT
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware khusus role: Organizer
export function organizerGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ORGANIZER") {
    return res.status(403).json({ message: "Forbidden: Organizer only" });
  }
  next();
}

// Middleware khusus role: Attendee
export function attendeeGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ATTENDEE") {
    return res.status(403).json({ message: "Forbidden: Attendee only" });
  }
  next();
}
