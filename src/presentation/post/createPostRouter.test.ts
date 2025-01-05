import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { PostEntity } from "../../domain/post/postEntity.js";
import { PostModel } from "../../validator/post.js";
import { PostPostRequestBody } from "./postRouter.js";

describe("createPost test", () => {
  //postRepositoryがcreateUsecaseへ依存しており、postRepositoryに対してもモック化する必要があるため下記のようにしてmockCreatePostUsecaseをモック化する
  let mockCreatePostUsecase: {
    run: jest.Mock<Promise<PostEntity>, [PostEntity]>;
  };
  //入力値
  const post: PostPostRequestBody = {
    sentence: "test",
    scheduleMinnutes: 20,
    actualMinutes: 23,
  };
  //mockCreatePostUsecaseの引数
  const mockPost = new PostEntity(undefined, "test", 1);
  //mockCreatePostUsecaseの戻り値
  const expectedPost = new PostEntity(1, "test", 1);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .post("/api/post", async (c) => {
      try {
        const postData = await c.req.json<PostPostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;

        const postValidataiion = PostModel.safeParse({
          ...postData,
          userId: userId,
        });
        if (!postValidataiion.success) {
          throw new ValidationError(
            postValidataiion.error.errors.map((err) => err.message).join(",")
          );
        }
        const output = await mockCreatePostUsecase.run(
          new PostEntity(undefined, postData.sentence, userId)
        );
        const responseBody = {
          sentence: output.sentence,
          userId: output.userId,
        };

        return c.json(responseBody, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to create post" }, 500);
      }
    });
  describe("creataPost", () => {
    beforeEach(() => {
      mockCreatePostUsecase = {
        run: jest.fn(),
      };
      mockCreatePostUsecase.run.mockResolvedValue(expectedPost);
    });

    it("ステータスコード201を返すこと", async () => {
      const client = testClient(app);
      const res = await client.api.post.$post({
        json: post,
      });

      expect(res.status).toBe(201);
      expect(mockCreatePostUsecase.run).toHaveBeenCalledWith(mockPost);
    });

    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidPost: PostPostRequestBody = {
        sentence: "testtesttesttesttesttesttesttesttesttesttesttesttest",
        scheduleMinnutes: 20,
        actualMinutes: 23,
      };
      const client = testClient(app);
      const res = await client.api.post.$post({
        json: invalidPost,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Title is must be 20");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockCreatePostUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.post.$post({
        json: post,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to create post" });
    });
  });
});
