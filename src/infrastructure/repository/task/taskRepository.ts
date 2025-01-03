import { Task } from "../../../domain/task/task.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";
import { TaskGateway } from "./taskGateway.js";
import { PrismaClient } from "@prisma/client";

const taskGateway = new TaskGateway(new PrismaClient());

export class TaskRepository implements TaskRepositoryInterface {
  async createTask(task: Task): Promise<Task> {
    const taskRes = await taskGateway.createTask(
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
  }
}
