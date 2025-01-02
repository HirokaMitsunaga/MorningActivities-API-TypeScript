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
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating user");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return undefined;
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get user by Email");
    }
  }
}
