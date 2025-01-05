import { Hono } from "hono";
import { ValidationError } from "../../validator/validationError.js";

describe("deletePost test", () => {
  //postRepositoryがdeleteUsecaseへ依存しており、postRepositoryに対してもモック化する必要があるため下記のようにしてmockDeletePostUsecaseをモック化する
  let mockDeletePostUsecase: {
    run: jest.Mock<Promise<void>, [number, number]>;
  };

  const deletePostData = {
    userId: 1,
    postId: 1,
  };

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/post/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const postId = Number(c.req.param("id"));

        await mockDeletePostUsecase.run(userId, postId);

        return c.json({ success: `delete post id = ${postId}` }, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        if (error instanceof Error) {
          return c.json({ error: error.message }, 500);
        }
        return c.json({ error: "Failed to delete post" }, 500);
      }
    });
  describe("deletePost", () => {
    beforeEach(() => {
      mockDeletePostUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockDeletePostUsecase.run.mockResolvedValue(undefined);

      const res = await app.request("/api/post/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(201);
      expect(mockDeletePostUsecase.run).toHaveBeenCalledWith(
        deletePostData.userId,
        deletePostData.postId
      );
    });
    it("タスクが存在しない時500を返す", async () => {
      mockDeletePostUsecase.run.mockRejectedValueOnce(
        new Error("Post not found")
      );

      const res = await app.request("/api/post/1", {
        method: "DELETE",
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Post not found" });
    });

    it("ステータスコードが500を返すこと", async () => {
      mockDeletePostUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const res = await app.request("/api/post/1", {
        method: "DELETE",
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Database connection error" });
    });
  });
});
