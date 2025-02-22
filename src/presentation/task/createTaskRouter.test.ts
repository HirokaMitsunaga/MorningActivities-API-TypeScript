import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { TaskEntity } from "../../domain/task/taskEntity.js";
import { TaskModel } from "../../validator/task.js";
import { TaskPostRequestBody } from "./taskRouter.js";

describe("createTask test", () => {
  //taskRepositoryがcreateUsecaseへ依存しており、taskRepositoryに対してもモック化する必要があるため下記のようにしてmockCreateTaskUsecaseをモック化する
  let mockCreateTaskUsecase: {
    run: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
  };
  //入力値
  const task: TaskPostRequestBody = {
    title: "test",
    scheduled_minutes: 20,
    actual_minutes: 23,
  };
  //mockCreateTaskUsecaseの引数
  const mockTask = new TaskEntity(undefined, "test", 1, 20, 23);
  //mockCreateTaskUsecaseの戻り値
  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .post("/api/task", async (c) => {
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
        const output = await mockCreateTaskUsecase.run(
          new TaskEntity(
            undefined,
            taskData.title,
            userId,
            taskData.scheduled_minutes ?? undefined,
            taskData.actual_minutes ?? undefined
          )
        );
        const responseBody = {
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
  describe("creataTask", () => {
    beforeEach(() => {
      mockCreateTaskUsecase = {
        run: jest.fn(),
      };
      mockCreateTaskUsecase.run.mockResolvedValue(expectedTask);
    });

    it("ステータスコード201を返すこと", async () => {
      const client = testClient(app);
      const res = await client.api.task.$post({
        json: task,
      });

      expect(res.status).toBe(201);
      expect(mockCreateTaskUsecase.run).toHaveBeenCalledWith(mockTask);
    });

    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidTask: TaskPostRequestBody = {
        title: "testtesttesttesttesttesttesttesttesttesttesttesttest",
        scheduled_minutes: 20,
        actual_minutes: 23,
      };
      const client = testClient(app);
      const res = await client.api.task.$post({
        json: invalidTask,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Title is must be 20");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockCreateTaskUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.task.$post({
        json: task,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create task" });
    });
  });
});
