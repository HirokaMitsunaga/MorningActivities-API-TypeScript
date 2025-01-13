import { Hono } from "hono";
import comment, { CommentPostRequestBody } from "./commentRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";
import { CommentEntity } from "../../domain/comment/commentEntity.js";
import { testClient } from "hono/testing";

describe("deleteCommentRouter", () => {
  let mockDeleteCommentUsecase: {
    run: jest.Mock<Promise<void>, [number, number, number]>;
  };
  //入力値
  //入力値
  const inputCommentData = {
    userId: 1,
    postId: 1,
    commentId: 1,
  };
  //出力値
  const outputCommentData = undefined;
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/comment/:id", async (c) => {
      try {
        const postData = await c.req.json<CommentPostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const commentId = Number(c.req.param("id"));

        //バリデーション
        await mockDeleteCommentUsecase.run(userId, postData.postId, commentId);
        return c.json({ success: `delete post id = ${commentId}` }, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        if (error instanceof DomainError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to create post" }, 500);
      }
    });
  beforeEach(() => {
    mockDeleteCommentUsecase = {
      run: jest.fn(),
    };
  });
  describe("deleteComment", () => {
    it("ステータスコード201を返すこと", async () => {
      mockDeleteCommentUsecase.run.mockResolvedValue(outputCommentData);
      mockDeleteCommentUsecase.run.mockResolvedValue(undefined);

      const res = await app.request("/api/comment/1", {
        method: "DELETE",
        body: JSON.stringify({ postId: inputCommentData.postId }), // 追加
      });

      expect(res.status).toBe(201);
      expect(mockDeleteCommentUsecase.run).toHaveBeenCalledWith(
        inputCommentData.userId,
        inputCommentData.postId,
        inputCommentData.commentId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockDeleteCommentUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const res = await app.request("/api/comment/1", {
        method: "DELETE",
        body: JSON.stringify({ postId: inputCommentData.postId }), // 追加
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
