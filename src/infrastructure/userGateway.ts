import { PrismaClient, User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";

export class UserGateway implements UserGatewayInterface {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async insert(userData: UserPostRequestBody): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: userData,
      });
      if (!user) {
        throw new Error("Failed to create user");
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating user");
    }
  }
}
