import { PrismaClient, Task } from "@prisma/client";

export interface TaskGatewayInterface {
  createTask(
    title: string,
    userId: number,
    scheduleMinnutes: number | null,
    actualMinutes: number | null
  ): Promise<Task>;
}

export class TaskGateway implements TaskGatewayInterface {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async createTask(
    title: string,
    userId: number,
    scheduleMinnutes: number | null,
    actualMinutes: number | null
  ): Promise<Task> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: title,
          userId: userId,
          scheduleMinnutes: scheduleMinnutes,
          actualMinutes: actualMinutes,
        },
      });
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating task");
    }
  }
}
