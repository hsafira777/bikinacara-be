import { Request, Response } from "express";
import * as userRepo from "../repositories/user.repository";

export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await userRepo.getAllUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const user = await userRepo.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createUserController(req: Request, res: Response) {
  try {
    const createdUser = await userRepo.createUser(req.body);
    return res.status(201).json(createdUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const updatedUser = await userRepo.updateUser(req.params.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    await userRepo.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

// Optional: Get currently logged-in user's detail
export async function getUserDetailController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id; 
    const user = await userRepo.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}




// import { Request, Response } from "express";
// import * as userRepo from "../repositories/user.repository";

// export async function getAllUsers(req: Request, res: Response) {
//   try {
//     const users = await userRepo.getAllUsers();
//     res.json(users);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function getUserById(req: Request, res: Response) {
//   try {
//     const user = await userRepo.getUserById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function createUser(req: Request, res: Response) {
//   try {
//     const newUser = await userRepo.createUser(req.body);
//     res.status(201).json(newUser);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function updateUser(req: Request, res: Response) {
//   try {
//     const updated = await userRepo.updateUser(req.params.id, req.body);
//     res.json(updated);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function deleteUser(req: Request, res: Response) {
//   try {
//     await userRepo.deleteUser(req.params.id);
//     res.status(204).send();
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }
