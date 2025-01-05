import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";

export class CreateTaskUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(task: TaskEntity): Promise<TaskEntity> {
    try {
      const TaskRes = await this._taskRepository.createTask(task);
      return TaskRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create task");
    }
  }
}
