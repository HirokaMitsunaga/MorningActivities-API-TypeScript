import { TaskEntity } from "../../domain/task/taskEntity.js";
import { TaskRepositoryInterface } from "../../domain/task/taskRepositoryInterface.js";

export class GetTaskByIdUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(userId: number, taskId: number): Promise<TaskEntity | undefined> {
    try {
      const taskRes = await this._taskRepository.getTaskById(userId, taskId);
      if (!taskRes) {
        return undefined;
      }
      return taskRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get task by id");
    }
  }
}
