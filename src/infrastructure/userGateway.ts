import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export class UserGateway {
  async insert(email: string, name: string, password: string) {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
    return user;
  }
}
