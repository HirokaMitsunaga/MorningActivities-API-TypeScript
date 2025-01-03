import { Hono } from "hono";
import { CreateTaskUsecase } from "../application/usecase/createTaskUsecase.js";
import { TaskRepository } from "../infrastructure/repository/task/taskRepository.js";
import { Task } from "../domain/task/task.js";
import { TaskModel } from "../validator/task.js";
import { ValidationError } from "../validator/validationError.js";
import { authMiddleware } from "../middleware/auth.js";

const task = new Hono();
task.use("/task/*", authMiddleware);

const createTaskUsecase = new CreateTaskUsecase(new TaskRepository());

export type TaskPostRequestBody = {
  title: string;
  userId: number;
  scheduleMinnutes: number | undefined;
  actualMinutes: number | undefined;
};

task.post("/task", async (c) => {
  try {
    const taskData = await c.req.json<TaskPostRequestBody>();

    const taskValidataiion = TaskModel.safeParse(taskData);
    if (!taskValidataiion.success) {
      throw new ValidationError(
        taskValidataiion.error.errors.map((err) => err.message).join(",")
      );
    }
    const output = await createTaskUsecase.run(
      new Task(
        undefined,
        taskData.title,
        taskData.userId,
        taskData.scheduleMinnutes ?? undefined,
        taskData.actualMinutes ?? undefined
      )
    );
    const responseBody = {
      title: output.title,
      userId: output.userId,
      scheduleMinnutes: output.scheduleMinnutes,
      actualMinutes: output.actualMinutes,
    };

    return c.json(responseBody, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create task" }, 500);
  }
});

export default task;
