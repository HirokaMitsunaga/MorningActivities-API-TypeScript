import { Task } from "./task.js";

export interface TaskRepositoryInterface {
  createTask(task: Task): Promise<Task>;
}
