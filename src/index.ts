import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routers
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";
import eventRouter from "./routers/event.router";
// import other routers if needed...

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use("/api/events", eventRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
