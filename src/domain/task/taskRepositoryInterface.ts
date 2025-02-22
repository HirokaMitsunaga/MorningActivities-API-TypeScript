import { TaskEntity } from "./taskEntity.js";

export interface TaskRepositoryInterface {
  createTask(task: TaskEntity): Promise<TaskEntity>;
  getAllTasks(userId: number): Promise<TaskEntity[] | undefined>;
  getTaskById(userId: number, taskId: number): Promise<TaskEntity | undefined>;
  updateTask(task: TaskEntity): Promise<TaskEntity>;
  deleteTask(userId: number, taskId: number): Promise<void>;
}
