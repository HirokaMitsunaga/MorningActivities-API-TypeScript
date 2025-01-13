import { Hono } from "hono";
import { LikePostRequestBody } from "./likeRouter.js";
import { ValidationError } from "../../validator/validationError.js";
import { DomainError } from "../../validator/domainError.js";

describe("deleteLikeRouter", () => {
  let mockDeleteLikeUsecase: {
    run: jest.Mock<Promise<void>, [number, number, number]>;
  };
  //入力値
  const inputLikeData = {
    userId: 1,
    postId: 1,
    likeId: 1,
  };
  //出力値
  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .delete("/api/like/:id", async (c) => {
      try {
        const postData = await c.req.json<LikePostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const likeId = Number(c.req.param("id"));

        //バリデーション
        await mockDeleteLikeUsecase.run(userId, postData.postId, likeId);

        return c.json({ success: `delete post id = ${likeId}` }, 201);
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
  describe("deleteLike", () => {
    it("ステータスコード201を返すこと", async () => {
      mockDeleteLikeUsecase.run.mockResolvedValue(undefined);

      const res = await app.request("/api/like/1", {
        method: "DELETE",
        body: JSON.stringify({ postId: inputLikeData.postId }), // 追加
      });
      console.log("Response:", res.status, res); // レスポンスの詳細を確認
      expect(res.status).toBe(201);
      expect(mockDeleteLikeUsecase.run).toHaveBeenCalledWith(
        inputLikeData.userId,
        inputLikeData.postId,
        inputLikeData.likeId
      );
    });
    it("ステータスコードが500を返すこと", async () => {
      mockDeleteLikeUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );
      const res = await app.request("/api/like/1", {
        method: "DELETE",
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
