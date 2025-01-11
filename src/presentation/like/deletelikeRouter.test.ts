import { Hono } from "hono";
import { LikePostRequestBody } from "./likeRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";
import { LikeEntity } from "../../domain/like/likeEntity.js";
import { testClient } from "hono/testing";

describe("deleteLikeRouter", () => {
  let mockDeleteLikeUsecase: {
    run: jest.Mock<Promise<LikeEntity>, [number, number]>;
  };
  //入力値
  const inputLikeData: LikePostRequestBody = {
    postId: 1,
  };
  //出力値
  const outputLikeData = new LikeEntity(1, 1, 1);
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/like/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const likeId = Number(c.req.param("id"));

        //バリデーション
        const output = await mockDeleteLikeUsecase.run(userId, likeId);

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
    mockDeleteLikeUsecase = {
      run: jest.fn(),
    };
  });
  describe("addLike", () => {
    it("ステータスコード201を返すこと", async () => {
      mockDeleteLikeUsecase.run.mockResolvedValue(outputLikeData);
      const client = testClient(app);
      const res = await client.api.like[":id"].$delete({
        param: { id: "1" },
      });

      expect(res.status).toBe(201);
      expect(mockDeleteLikeUsecase.run).toHaveBeenCalledWith(
        outputLikeData.userId,
        outputLikeData.postId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockDeleteLikeUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const client = testClient(app);
      const res = await client.api.like[":id"].$delete({
        param: { id: "1" },
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
