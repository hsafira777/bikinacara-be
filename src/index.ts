import express, { Request, Response, NextFunction } from "express";
import { PORT } from "./config";

// Router
// import userRouter from "./routers/user.router";
// import expenseRouter from "./routers/expense.router";
// import authRouter from "./routers/auth.router";

const port = PORT || 8080;

const app = express();

// MIDDLEWARE
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("API is running well");
});

// ENDPOINT
// app.use("/api/users", userRouter);
// app.use("/api/auth", authRouter);

// ERROR MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
