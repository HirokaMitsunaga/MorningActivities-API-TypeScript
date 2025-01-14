import { Hono } from "hono";
import { CommentLikePostRequestBody } from "./commentLikeRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";

describe("deleteCommentLikeRouter", () => {
  let mockDeleteCommentLikeUsecase: {
    run: jest.Mock<Promise<void>, [number, number, number]>;
  };
  //入力値
  const inputCommentLikeData = {
    userId: 1,
    commentId: 1,
    commentLikeId: 1,
  };
  //出力値
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/comment-like/:id", async (c) => {
      try {
        const postData = await c.req.json<CommentLikePostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const commentLikeId = Number(c.req.param("id"));

        //バリデーション
        await mockDeleteCommentLikeUsecase.run(
          userId,
          postData.commentId,
          commentLikeId
        );

        return c.json({ success: `delete post id = ${commentLikeId}` }, 201);
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
    mockDeleteCommentLikeUsecase = {
      run: jest.fn(),
    };
  });
  describe("deleteCommentLike", () => {
    it("ステータスコード201を返すこと", async () => {
      mockDeleteCommentLikeUsecase.run.mockResolvedValue(undefined);

      const res = await app.request("/api/comment-like/1", {
        method: "DELETE",
        body: JSON.stringify({ commentId: inputCommentLikeData.commentId }), // 追加
      });
      expect(res.status).toBe(201);
      expect(mockDeleteCommentLikeUsecase.run).toHaveBeenCalledWith(
        inputCommentLikeData.userId,
        inputCommentLikeData.commentId,
        inputCommentLikeData.commentLikeId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockDeleteCommentLikeUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const res = await app.request("/api/comment-like/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
