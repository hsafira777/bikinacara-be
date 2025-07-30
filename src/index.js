"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
// Router
// import userRouter from "./routers/user.router";
// import expenseRouter from "./routers/expense.router";
// import authRouter from "./routers/auth.router";
const port = config_1.PORT || 8080;
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json());
app.get("/api", (req, res) => {
    res.send("API is running well");
});
// ENDPOINT
// app.use("/api/users", userRouter);
// app.use("/api/auth", authRouter);
// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
