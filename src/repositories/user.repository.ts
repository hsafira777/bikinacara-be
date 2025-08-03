// // import prisma from "../lib/prisma";
// // import { IRegisterParams } from "../interfaces/user.types";

// // export async function createUserRepo(
// //   params: IRegisterParams & { hashedPassword: string; referralCode: string }
// // ) {
// //   return prisma.user.create({
// //     data: {
// //       name: params.name,
// //       email: params.email,
// //       password: params.hashedPassword,
// //       role: params.role,
// //       referralCode: params.referralCode,
// //       referredById: params.referredById || null,
// //     },
// //   });
// // }

// // export async function findUserByEmail(email: string) {
// //   return prisma.user.findUnique({
// //     where: { email },
// //   });
// // }

// // export async function findUserById(id: string) {
// //   return prisma.user.findUnique({
// //     where: { id },
// //   });
// // }

// import prisma from "../lib/prisma";
// import { ICreateUserParam, IUpdateUserParam } from "../interfaces/user.types";

// export async function getAllUsersRepo() {
//   return prisma.user.findMany();
// }

// export async function getUserByIdRepo(id: string) {
//   return prisma.user.findUnique({
//     where: { id },
//   });
// }

// export async function createUserRepo(params: ICreateUserParam) {
//   return prisma.user.create({
//     data: params,
//   });
// }

// export async function updateUserRepo(id: string, params: IUpdateUserParam) {
//   return prisma.user.update({
//     where: { id },
//     data: params,
//   });
// }

// export async function deleteUserRepo(id: string) {
//   return prisma.user.delete({
//     where: { id },
//   });
// }

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
