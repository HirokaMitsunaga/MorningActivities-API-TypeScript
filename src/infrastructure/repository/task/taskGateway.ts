import { PrismaClient, Task } from "@prisma/client";

export interface TaskGatewayInterface {
  createTask(
    title: string,
    userId: number,
    scheduleMinnutes: number | null,
    actualMinutes: number | null
  ): Promise<Task>;
  getAllTasks(userId: number): Promise<Task[] | undefined>;
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
  async getAllTasks(userId: number): Promise<Task[] | undefined> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: userId,
        },
      });
      if (!tasks) {
        return undefined;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get all tasks");
    }
  }
}
