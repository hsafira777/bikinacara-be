import prisma from "../lib/prisma";
import { compare, genSaltSync, hashSync } from "bcrypt";
import { ILoginParam, IRegisterParam } from "../interfaces/auth.types";
import { User } from "@prisma/client";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

function generateReferralCode(name: string) {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${name.substring(0, 3).toUpperCase()}-${random}`;
}

export async function registerUser(params: IRegisterParam) {
  const existing = await findUserByEmail(params.email);
  if (existing) throw new Error("Email already registered");

  const salt = genSaltSync(10);
  const hashed = hashSync(params.password, salt);

  const referralCode = generateReferralCode(params.name);

  // Cari user yang memberikan referral (jika ada)
  const referredByUser: User | null = params.referralCode
    ? await prisma.user.findUnique({
        where: { referralCode: params.referralCode },
      })
    : null;

  return prisma.user.create({
    data: {
      role: params.role,
      name: params.name,
      email: params.email,
      password: hashed,
      referralCode: referralCode,
      referredById: referredByUser?.id ?? null, // ← Ini otomatis null jika gak ada referral
    },
  });
  
}
