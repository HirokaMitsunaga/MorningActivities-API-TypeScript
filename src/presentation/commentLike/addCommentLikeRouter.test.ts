import { Hono } from "hono";
import { CommentLikePostRequestBody } from "./commentLikeRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";
import { CommentLikeEntity } from "../../domain/commentLike/commentLikeEntity.js";
import { testClient } from "hono/testing";

describe("commentLikeRouter", () => {
  let mockAddCommentLikeUsecase: {
    run: jest.Mock<Promise<CommentLikeEntity>, [number, number]>;
  };
  //入力値
  const inputCommentLikeData: CommentLikePostRequestBody = {
    commentId: 1,
  };
  //出力値
  const outputCommentLikeData = new CommentLikeEntity(1, 1, 1);
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .post("/api/comment-like", async (c) => {
      try {
        const postData = await c.req.json<CommentLikePostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;

        //バリデーション
        const output = await mockAddCommentLikeUsecase.run(
          userId,
          postData.commentId
        );

        const responseBody = {
          id: output.id,
          userId: output.userId,
          commentId: output.commentId,
        };
        return c.json(responseBody, 201);
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
    mockAddCommentLikeUsecase = {
      run: jest.fn(),
    };
  });
  describe("addCommentLike", () => {
    it("ステータスコード201を返すこと", async () => {
      mockAddCommentLikeUsecase.run.mockResolvedValue(outputCommentLikeData);

      const res = await app.request("/api/comment-like", {
        method: "POST",
        body: JSON.stringify({ commentId: inputCommentLikeData.commentId }), // 追加
      });

      expect(res.status).toBe(201);
      expect(mockAddCommentLikeUsecase.run).toHaveBeenCalledWith(
        outputCommentLikeData.userId,
        outputCommentLikeData.commentId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockAddCommentLikeUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const res = await app.request("/api/comment-like", {
        method: "POST",
        body: JSON.stringify({ commentId: inputCommentLikeData.commentId }),
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
