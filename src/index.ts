import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";


// Load environment variables
dotenv.config();

// Import routers
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";
import eventRouter from "./routers/event.router";
import transactionRoutes from "./routers/transaction.router";
import dashboardRoutes from "./routers/dashboard.router";
import statisticRoutes from "./routers/statistic.router";
// import other routers if needed...

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/filter", eventRouter);
app.use("/api/upcoming", eventRouter);
app.use("/api/:id", eventRouter);

app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/statistics", statisticRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
