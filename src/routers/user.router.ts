import { Router } from "express";
import {
  createUserController,
  getUserDetailController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Get all users
router.get("/", verifyToken, getAllUsersController);

// Create new user
router.post("/", createUserController);

// Get current user detail
router.get("/detail", verifyToken, getUserDetailController);

// Get user by ID
router.get("/:id", verifyToken, getUserByIdController);

// Update user
router.put("/:id", verifyToken, updateUserController);

// Delete user
router.delete("/:id", verifyToken, deleteUserController);

export default router;
