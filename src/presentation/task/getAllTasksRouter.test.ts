import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { TaskEntity } from "../../domain/task/taskEntity.js";

describe("getAllTasks test", () => {
  let mockGetAllTasksUsecase: {
    run: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
  };
  const taskData = {
    userId: 1,
    taskId: 1,
  };
  //mockGetAllTasksUsecaseの引数
  const mockTask = new TaskEntity(undefined, "test", 1, 20, 23);
  //mockGetAllTasksUsecaseの戻り値
  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);
  const expectedTasks = [
    new TaskEntity(
      expectedTask.id,
      expectedTask.title,
      expectedTask.userId,
      expectedTask.scheduleMinnutes,
      expectedTask.actualMinutes
    ),
  ];

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .get("/api/task", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;

        const output = await mockGetAllTasksUsecase.run(userId);
        if (!output) {
          return c.json({ error: "Not found tasks" }, 400);
        }

        return c.json(output, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to found tasks" }, 500);
      }
    });

  describe("getAllTasks", () => {
    beforeEach(() => {
      mockGetAllTasksUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockGetAllTasksUsecase.run.mockResolvedValue(expectedTasks);

      const client = testClient(app);
      const res = await client.api.task.$get({
        json: taskData.userId,
      });

      expect(res.status).toBe(201);
      expect(mockGetAllTasksUsecase.run).toHaveBeenCalledWith(taskData.userId);
      expect(await res.json()).toEqual(expectedTasks);
    });

    it("タスクが存在しない時は400を返すこと", async () => {
      mockGetAllTasksUsecase.run.mockResolvedValue(undefined);

      const client = testClient(app);
      const res = await client.api.task.$get({
        json: taskData.userId,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Not found tasks");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockGetAllTasksUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.task.$get({
        json: taskData.userId,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to found tasks" });
    });
  });
});
