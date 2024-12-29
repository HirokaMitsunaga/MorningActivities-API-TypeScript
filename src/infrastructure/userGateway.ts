import { PrismaClient, User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";
// const prisma = new PrismaClient();

export class UserGateway implements UserGatewayInterface {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  async insert(userData: UserPostRequestBody): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }
}
