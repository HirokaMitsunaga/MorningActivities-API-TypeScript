import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";

export class GetAllTasksUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(userId: number): Promise<TaskEntity[] | undefined> {
    try {
      const TasksRes = await this._taskRepository.getAllTasks(userId);
      if (!TasksRes) {
        return undefined;
      }
      return TasksRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get all tasks");
    }
  }
}
