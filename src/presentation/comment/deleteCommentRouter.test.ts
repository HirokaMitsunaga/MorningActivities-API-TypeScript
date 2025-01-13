import { Hono } from "hono";
import { CommentPostRequestBody } from "./commentRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";
import { CommentEntity } from "../../domain/comment/commentEntity.js";
import { testClient } from "hono/testing";

describe("deleteCommentRouter", () => {
  let mockDeleteCommentUsecase: {
    run: jest.Mock<Promise<CommentEntity>, [number, number]>;
  };
  //入力値
  const inputCommentData: CommentPostRequestBody = {
    postId: 1,
  };
  //出力値
  const outputCommentData = new CommentEntity(1, 1, 1);
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/comment/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const commentId = Number(c.req.param("id"));

        //バリデーション
        const output = await mockDeleteCommentUsecase.run(userId, commentId);

        const responseBody = {
          id: output.id,
          userId: output.userId,
          postId: output.postId,
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
    mockDeleteCommentUsecase = {
      run: jest.fn(),
    };
  });
  describe("addComment", () => {
    it("ステータスコード201を返すこと", async () => {
      mockDeleteCommentUsecase.run.mockResolvedValue(outputCommentData);
      const client = testClient(app);
      const res = await client.api.comment[":id"].$delete({
        param: { id: "1" },
      });

      expect(res.status).toBe(201);
      expect(mockDeleteCommentUsecase.run).toHaveBeenCalledWith(
        outputCommentData.userId,
        outputCommentData.postId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockDeleteCommentUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const client = testClient(app);
      const res = await client.api.comment[":id"].$delete({
        param: { id: "1" },
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});