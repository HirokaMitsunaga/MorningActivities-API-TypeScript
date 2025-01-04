import { Task } from "../../domain/task/task.js";
import { TaskRepositoryInterface } from "../../domain/task/taskRepositoryInterface.js";

export class CreateTaskUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(task: Task): Promise<Task> {
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
