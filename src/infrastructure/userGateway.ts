import { PrismaClient, User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";

export class UserGateway implements UserGatewayInterface {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async insert(userData: UserPostRequestBody): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }
}
