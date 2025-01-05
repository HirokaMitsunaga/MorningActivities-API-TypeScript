import { Hono } from "hono";
import { ValidationError } from "../validator/validationError.js";
import { TaskEntity } from "../domain/task/taskEntity.js";
import { TaskModel } from "../validator/task.js";
import { TaskPostRequestBody } from "./taskRouter.js";

describe("deleteTask test", () => {
  //taskRepositoryがdeleteUsecaseへ依存しており、taskRepositoryに対してもモック化する必要があるため下記のようにしてmockDeleteTaskUsecaseをモック化する
  let mockDeleteTaskUsecase: {
    run: jest.Mock<Promise<void>, [number, number]>;
  };

  const deleteTaskData = {
    userId: 1,
    taskId: 1,
  };

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/task/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const taskId = Number(c.req.param("id"));

        await mockDeleteTaskUsecase.run(userId, taskId);

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
  describe("deleteTask", () => {
    beforeEach(() => {
      mockDeleteTaskUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockDeleteTaskUsecase.run.mockResolvedValue(undefined);

      const res = await app.request("/api/task/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(201);
      expect(mockDeleteTaskUsecase.run).toHaveBeenCalledWith(
        deleteTaskData.userId,
        deleteTaskData.taskId
      );
    });
    it("タスクが存在しない時500を返す", async () => {
      mockDeleteTaskUsecase.run.mockRejectedValueOnce(
        new Error("Task not found")
      );

      const res = await app.request("/api/task/1", {
        method: "DELETE",
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Task not found" });
    });

    it("ステータスコードが500を返すこと", async () => {
      mockDeleteTaskUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const res = await app.request("/api/task/1", {
        method: "DELETE",
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Database connection error" });
    });
  });
});
