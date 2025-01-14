import { Hono } from "hono";
import { LikePostRequestBody } from "./likeRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";
import { LikeEntity } from "../../domain/like/likeEntity.js";
import { testClient } from "hono/testing";

describe("likeRouter", () => {
  let mockAddLikeUsecase: {
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
    .post("/api/like", async (c) => {
      try {
        const postData = await c.req.json<LikePostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;

        //バリデーション
        const output = await mockAddLikeUsecase.run(userId, postData.postId);

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
    mockAddLikeUsecase = {
      run: jest.fn(),
    };
  });
  describe("addLike", () => {
    it("ステータスコード201を返すこと", async () => {
      mockAddLikeUsecase.run.mockResolvedValue(outputLikeData);
      const client = testClient(app);
      const res = await client.api.like.$post({
        json: inputLikeData,
      });

      expect(res.status).toBe(201);
      expect(mockAddLikeUsecase.run).toHaveBeenCalledWith(
        outputLikeData.userId,
        outputLikeData.postId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockAddLikeUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const client = testClient(app);
      const res = await client.api.like.$post({
        json: inputLikeData,
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
