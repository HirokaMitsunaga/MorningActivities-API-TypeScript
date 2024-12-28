import { PrismaClient, User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";
const prisma = new PrismaClient();

export class UserGateway implements UserGatewayInterface {
  async insert(userData: UserPostRequestBody): Promise<User> {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  }
}
