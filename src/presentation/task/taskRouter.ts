import { Hono } from "hono";
import { CreateTaskUsecase } from "../../application/usecase/task/createTaskUsecase.js";
import { TaskRepository } from "../../infrastructure/repository/task/taskRepository.js";
import { TaskEntity } from "../../domain/task/taskEntity.js";
import { TaskModel } from "../../validator/task.js";
import { ValidationError } from "../../validator/validationError.js";
import { authMiddleware } from "../../middleware/auth.js";
import { TaskGateway } from "../../infrastructure/repository/task/taskGateway.js";
import { PrismaClient } from "@prisma/client";
import { GetAllTasksUsecase } from "../../application/usecase/task/getAllTasksUsecase.js";
import { GetTaskByIdUsecase } from "../../application/usecase/task/getTaskByIdUsecase.js";
import { UpdateTaskUsecase } from "../../application/usecase/task/updateTaskUsecase.js";
import { DeleteTaskUsecase } from "../../application/usecase/task/deleteTaskUsecase.js";
import { DomainError } from "../../validator/domainError.js";

const task = new Hono();
task.use("/task/*", authMiddleware);

const createTaskUsecase = new CreateTaskUsecase(
  new TaskRepository(new TaskGateway(new PrismaClient()))
);

const getAllTasksUsecase = new GetAllTasksUsecase(
  new TaskRepository(new TaskGateway(new PrismaClient()))
);

const getTaskByIdUsecase = new GetTaskByIdUsecase(
  new TaskRepository(new TaskGateway(new PrismaClient()))
);

const updateTaskUsecase = new UpdateTaskUsecase(
  new TaskRepository(new TaskGateway(new PrismaClient()))
);

const deleteTaskUsecase = new DeleteTaskUsecase(
  new TaskRepository(new TaskGateway(new PrismaClient()))
);

export type TaskPostRequestBody = {
  title: string;
  scheduled_minutes: number | undefined;
  actual_minutes: number | undefined;
};

task.post("/task", async (c) => {
  try {
    const taskData = await c.req.json<TaskPostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    const taskValidataiion = TaskModel.safeParse({
      ...taskData,
      userId: userId,
    });
    if (!taskValidataiion.success) {
      throw new ValidationError(
        taskValidataiion.error.errors.map((err) => err.message).join(",")
      );
    }
    const output = await createTaskUsecase.run(
      new TaskEntity(
        undefined,
        taskData.title,
        userId,
        taskData.scheduled_minutes,
        taskData.actual_minutes
      )
    );
    const responseBody = {
      id: output.id,
      title: output.title,
      userId: output.userId,
      scheduled_minutes: output.scheduleMinutes,
      actual_minutes: output.actualMinutes,
    };

    return c.json(responseBody, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create task" }, 500);
  }
});

task.get("/task", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    const output = await getAllTasksUsecase.run(userId);

    if (!output) {
      return c.json(output, 201);
    }

    const responseBody = output.map((task) => ({
      id: task.id,
      title: task.title,
      userId: task.userId,
      scheduled_minutes: task.scheduleMinutes,
      actual_minutes: task.actualMinutes,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    }));

    return c.json(responseBody, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to get tasks" }, 500);
  }
});

task.get("/task/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const taskId = Number(c.req.param("id"));

    const output = await getTaskByIdUsecase.run(userId, taskId);

    if (!output) {
      return c.json(output, 201);
    }

    const responseBody = {
      id: output.id,
      title: output.title,
      userId: output.userId,
      scheduled_minutes: output.scheduleMinutes,
      actual_minutes: output.actualMinutes,
      created_at: output.createdAt,
      updated_at: output.updatedAt,
    };

    return c.json(responseBody, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to found to get task by id" }, 500);
  }
});

task.put("/task/:id", async (c) => {
  try {
    const taskData = await c.req.json<TaskPostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const taskId = Number(c.req.param("id"));

    const taskValidataiion = TaskModel.safeParse({
      ...taskData,
      userId: userId,
    });
    if (!taskValidataiion.success) {
      throw new ValidationError(
        taskValidataiion.error.errors.map((err) => err.message).join(",")
      );
    }
    const output = await updateTaskUsecase.run(
      new TaskEntity(
        taskId,
        taskData.title,
        userId,
        taskData.scheduled_minutes,
        taskData.actual_minutes
      )
    );
    if (!output) {
      return c.body(null, 204);
    }
    const responseBody = {
      id: output.id,
      title: output.title,
      userId: output.userId,
      scheduled_minutes: output.scheduleMinutes,
      actual_minutes: output.actualMinutes,
    };

    return c.json(responseBody, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof DomainError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to update task" }, 500);
  }
});

task.delete("/task/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const taskId = Number(c.req.param("id"));

    await deleteTaskUsecase.run(userId, taskId);

    return c.json({ success: `delete task id = ${taskId}` }, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

export default task;
