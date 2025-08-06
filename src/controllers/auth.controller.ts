import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import {
  findUserByEmail,
  verifyPassword,
  registerUser,
} from "../repositories/auth.repository";
import { ILoginParam } from "../interfaces/auth.types";

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password }: ILoginParam = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function registerNewUser(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
