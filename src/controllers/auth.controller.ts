import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail, registerUser } from "../repositories/auth.repository";
import { ILoginParam } from "../interfaces/auth.types";
import { applyReferralOnRegister } from "../services/referral.service";

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



    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!, 
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
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

export async function registerNewUser(req: Request, res: Response) {
  try {
    const { referralCode, ...userData } = req.body;
    const user = await registerUser(userData);

    if (referralCode) {
      await applyReferralOnRegister(user.id, referralCode);
    }

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        referralCode: referralCode,
        referredBy: referralCode || undefined,
      },
    });
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: err.message || "Registration failed" });
  }
}
