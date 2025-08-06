import prisma from "../lib/prisma";
import { compare, genSaltSync, hashSync } from "bcrypt";
import { ILoginParam, IRegisterParam } from "../interfaces/auth.types";

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

  let referredById: string | undefined = undefined;

  // Cek apakah user daftar pakai kode referral
  if (params.referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: params.referralCode },
    });

    if (referrer) {
      referredById = referrer.id;
    }
  }

  return prisma.user.create({
    data: {
      role: params.role,
      name: params.name,
      email: params.email,
      password: hashed,
      referralCode,
      referredById,
    },
  });
}
