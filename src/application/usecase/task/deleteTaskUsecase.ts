import { TaskRepositoryInterface } from "../../../domain/task/taskRepositoryInterface.js";

export class DeleteTaskUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(userId: number, taskId: number): Promise<void> {
    try {
      const existingTask = await this._taskRepository.getTaskById(
        userId,
        taskId
      );
      if (!existingTask) {
        throw new Error("Task not found");
      }

      await this._taskRepository.deleteTask(userId, taskId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete task");
    }
  }
}
