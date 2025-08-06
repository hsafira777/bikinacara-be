import prisma from "../lib/prisma";
import { ICreateUserParam, IUpdateUserParam } from "../interfaces/user.types";
import { genSaltSync, hashSync } from "bcrypt";

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(params: ICreateUserParam) {
  const existingUser = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(params.password, salt);

  return prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: hashedPassword,
      profilePic: params.profilePic,
      role: params.role,
      referralCode: params.refeallCode || null,
    },
  });
}

export async function updateUser(id: string, params: IUpdateUserParam) {
  if (params.password) {
    const salt = genSaltSync(10);
    params.password = hashSync(params.password, salt);
  }

  return prisma.user.update({
    where: { id },
    data: params,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
