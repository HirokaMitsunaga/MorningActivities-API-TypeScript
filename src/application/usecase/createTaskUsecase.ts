import { Task } from "../../domain/task/task.js";
import { TaskRepositoryInterface } from "../../domain/task/taskRepositoryInterface.js";

export class CreateTaskUsecase {
  constructor(private _taskRepository: TaskRepositoryInterface) {}
  async run(task: Task): Promise<Task> {
    const TaskRes = await this._taskRepository.createTask(task);

    return TaskRes;
  }
}
