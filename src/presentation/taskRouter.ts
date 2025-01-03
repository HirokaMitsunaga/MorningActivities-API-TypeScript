import { Hono } from "hono";
import { CreateTaskUsecase } from "../application/usecase/createTaskUsecase.js";
import { TaskRepository } from "../infrastructure/repository/task/taskRepository.js";
import { Task } from "../domain/task/task.js";

const task = new Hono();

const createTaskUsecase = new CreateTaskUsecase(new TaskRepository());

export type TaskPostRequestBody = {
  title: string;
  userId: number;
  scheduleMinnutes: number | undefined;
  actualMinutes: number | undefined;
};

task.post("/task", async (c) => {
  const taskData = await c.req.json<TaskPostRequestBody>();

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
});

export default task;
