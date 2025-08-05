import prisma from "../lib/prisma";
import { compare } from "bcrypt";
import { ILoginParam, IRegisterParam } from "../interfaces/auth.types";
import { genSaltSync, hashSync } from "bcrypt";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function registerUser(params: IRegisterParam) {
  const existing = await findUserByEmail(params.email);
  if (existing) throw new Error("Email already registered");

  const salt = genSaltSync(10);
  const hashed = hashSync(params.password, salt);

  return prisma.user.create({
    data: {
      email: params.email,
      password: hashed,
      name: params.name,
      role: params.role || "user",
    },
  });
}
