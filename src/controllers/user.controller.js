"use strict";
// import { Request, Response } from "express";
// import prisma from "../libs/prisma";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// export const registerUser = async (req: Request, res: Response) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashed,
//         role,
//         referralCode: generateReferralCode(),
//       },
//     });
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to register user" });
//   }
// };
// function generateReferralCode(): string {
//   return Math.random().toString(36).substring(2, 8).toUpperCase();
// }
