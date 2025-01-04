import { TaskEntity } from "./taskEntity.js";

export interface TaskRepositoryInterface {
  createTask(task: TaskEntity): Promise<TaskEntity>;
  getAllTasks(userId: number): Promise<TaskEntity[] | undefined>;
}
