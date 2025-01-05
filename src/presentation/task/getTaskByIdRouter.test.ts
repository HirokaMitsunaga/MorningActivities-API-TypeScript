import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { TaskEntity } from "../../domain/task/taskEntity.js";

describe("getTaskById test", () => {
  let mockGetTaskByIdUsecase: {
    run: jest.Mock<Promise<TaskEntity | undefined>, [number, number]>;
  };
  const taskData = {
    userId: 1,
    taskId: 1,
  };
  //mockGetTaskByIdUsecaseの引数
  const mockTask = new TaskEntity(undefined, "test", 1, 20, 23);
  //mockGetTaskByIdUsecaseの戻り値
  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .get("/api/task/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const taskId = Number(c.req.param("id"));

        const output = await mockGetTaskByIdUsecase.run(userId, taskId);
        if (!output) {
          return c.json({ error: "Not found task" }, 400);
        }

        return c.json(output, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to found to get task by id" }, 500);
      }
    });

  describe("getAllTasks", () => {
    beforeEach(() => {
      mockGetTaskByIdUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockGetTaskByIdUsecase.run.mockResolvedValue(expectedTask);

      const client = testClient(app);
      const res = await client.api.task[":id"].$get({
        param: {
          id: taskData.taskId.toString(),
        },
      });
      expect(res.status).toBe(201);
      expect(mockGetTaskByIdUsecase.run).toHaveBeenCalledWith(
        taskData.userId,
        taskData.taskId
      );
      expect(await res.json()).toEqual(expectedTask);
    });

    it("タスクが存在しない時は400を返すこと", async () => {
      mockGetTaskByIdUsecase.run.mockResolvedValue(undefined);

      const client = testClient(app);
      const res = await client.api.task[":id"].$get({
        param: {
          id: taskData.taskId.toString(),
        },
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Not found task");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockGetTaskByIdUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.task[":id"].$get({
        param: {
          id: taskData.taskId.toString(),
        },
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to found to get task by id" });
    });
  });
});
