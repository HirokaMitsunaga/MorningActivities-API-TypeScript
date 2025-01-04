import { Task } from "../../../domain/task/task.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";
import { TaskGateway, TaskGatewayInterface } from "./taskGateway.js";
import { PrismaClient } from "@prisma/client";

const taskGateway = new TaskGateway(new PrismaClient());

export class TaskRepository implements TaskRepositoryInterface {
  constructor(private _taskGateway: TaskGatewayInterface) {}
  async createTask(task: Task): Promise<Task> {
    try {
      const taskRes = await this._taskGateway.createTask(
        task.title,
        task.userId,
        task.scheduleMinnutes ?? null,
        task.actualMinutes ?? null
      );
      return new Task(
        taskRes.id,
        taskRes.title,
        taskRes.userId,
        taskRes.scheduleMinnutes ?? undefined,
        taskRes.actualMinutes ?? undefined
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create task");
    }
  }
}
