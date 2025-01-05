import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../validator/validationError.js";
import { TaskEntity } from "../domain/task/taskEntity.js";
import { TaskModel } from "../validator/task.js";
import { TaskPostRequestBody } from "./taskRouter.js";

declare module "hono/testing" {
  interface ClientRequestOptions {
    json?: unknown;
  }
}
describe("updateTask test", () => {
  //taskRepositoryがupdateUsecaseへ依存しており、taskRepositoryに対してもモック化する必要があるため下記のようにしてmockUpdateTaskUsecaseをモック化する
  let mockUpdateTaskUsecase: {
    run: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
  };
  //入力値
  const task: TaskPostRequestBody = {
    title: "test",
    scheduleMinnutes: 20,
    actualMinutes: 23,
  };
  //mockUpdateTaskUsecaseの引数
  const mockTask = new TaskEntity(1, "test", 1, 20, 23);
  mockTask.id as number;
  //mockUpdateTaskUsecaseの戻り値
  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .put("/api/task/:id", async (c) => {
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
        const output = await mockUpdateTaskUsecase.run(
          new TaskEntity(
            taskId,
            taskData.title,
            userId,
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
        return c.json({ error: "Failed to update task" }, 500);
      }
    });
  describe("updateTask", () => {
    beforeEach(() => {
      mockUpdateTaskUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockUpdateTaskUsecase.run.mockResolvedValue(expectedTask);

      const res = await app.request("/api/task/1", {
        method: "PUT",
        body: JSON.stringify({
          title: mockTask.title,
          scheduleMinnutes: mockTask.scheduleMinnutes,
          actualMinutes: mockTask.actualMinutes,
        }),
      });

      expect(res.status).toBe(201);
      expect(mockUpdateTaskUsecase.run).toHaveBeenCalledWith(mockTask);
    });

    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidTask: TaskPostRequestBody = {
        title: "testtesttesttesttesttesttesttesttesttesttesttesttest",
        scheduleMinnutes: 20,
        actualMinutes: 23,
      };
      const res = await app.request("/api/task/1", {
        method: "PUT",
        body: JSON.stringify({
          title: invalidTask.title,
          scheduleMinnutes: invalidTask.scheduleMinnutes,
          actualMinutes: invalidTask.actualMinutes,
        }),
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Title is must be 20");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockUpdateTaskUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const res = await app.request("/api/task/1", {
        method: "PUT",
        body: JSON.stringify({
          title: mockTask.title,
          scheduleMinnutes: mockTask.scheduleMinnutes,
          actualMinutes: mockTask.actualMinutes,
        }),
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to update task" });
    });
  });
});
