import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";
import { TaskGatewayInterface } from "./taskGateway.js";

export class TaskRepository implements TaskRepositoryInterface {
  constructor(private _taskGateway: TaskGatewayInterface) {}
  async createTask(task: TaskEntity): Promise<TaskEntity> {
    try {
      const taskRes = await this._taskGateway.createTask(
        task.title,
        task.userId,
        task.scheduleMinnutes ?? null,
        task.actualMinutes ?? null
      );
      return new TaskEntity(
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
  async getAllTasks(userId: number): Promise<TaskEntity[] | undefined> {
    try {
      const tasksRes = await this._taskGateway.getAllTasks(userId);
      if (!tasksRes) {
        return undefined;
      }
      return tasksRes.map(
        (taskRes) =>
          new TaskEntity(
            taskRes.id,
            taskRes.title,
            taskRes.userId,
            taskRes.scheduleMinnutes ?? undefined,
            taskRes.actualMinutes ?? undefined
          )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create task");
    }
  }
}
