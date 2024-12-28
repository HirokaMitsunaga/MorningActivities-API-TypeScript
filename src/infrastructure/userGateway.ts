import { PrismaClient, User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/userRouter.js";
const prisma = new PrismaClient();

export class UserGateway {
  async insert(userData: UserPostRequestBody): Promise<User> {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  }
}
