import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";

export class UpdateTaskUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(task: TaskEntity): Promise<TaskEntity> {
    try {
      if (typeof task.id !== "number") {
        throw new Error("taskId is required and must be a number");
      }
      const TaskRes = await this._taskRepository.updateTask(task);
      return TaskRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while update task");
    }
  }
}
