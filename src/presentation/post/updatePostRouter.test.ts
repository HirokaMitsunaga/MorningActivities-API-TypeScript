import { Hono } from "hono";
import { ValidationError } from "../../validator/validationError.js";
import { PostEntity } from "../../domain/post/postEntity.js";
import { PostModel } from "../../validator/post.js";
import { PostPostRequestBody } from "./postRouter.js";

describe("updatePost test", () => {
  //postRepositoryがupdateUsecaseへ依存しており、postRepositoryに対してもモック化する必要があるため下記のようにしてmockUpdatePostUsecaseをモック化する
  let mockUpdatePostUsecase: {
    run: jest.Mock<Promise<PostEntity>, [PostEntity]>;
  };
  //入力値
  const post: PostPostRequestBody = {
    sentence: "test",
    scheduleMinnutes: 20,
    actualMinutes: 23,
  };
  //mockUpdatePostUsecaseの引数
  const mockPost = new PostEntity(1, "test", 1);
  mockPost.id as number;
  //mockUpdatePostUsecaseの戻り値
  const expectedPost = new PostEntity(1, "test", 1);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .put("/api/post/:id", async (c) => {
      try {
        const postData = await c.req.json<PostPostRequestBody>();
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const postId = Number(c.req.param("id"));

        const postValidataiion = PostModel.safeParse({
          ...postData,
          userId: userId,
        });
        if (!postValidataiion.success) {
          throw new ValidationError(
            postValidataiion.error.errors.map((err) => err.message).join(",")
          );
        }
        const output = await mockUpdatePostUsecase.run(
          new PostEntity(postId, postData.sentence, userId)
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
        return c.json({ error: "Failed to update post" }, 500);
      }
    });
  describe("updatePost", () => {
    beforeEach(() => {
      mockUpdatePostUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockUpdatePostUsecase.run.mockResolvedValue(expectedPost);

      const res = await app.request("/api/post/1", {
        method: "PUT",
        body: JSON.stringify({
          sentence: mockPost.sentence,
        }),
      });

      expect(res.status).toBe(201);
      expect(mockUpdatePostUsecase.run).toHaveBeenCalledWith(mockPost);
    });

    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidPost: PostPostRequestBody = {
        sentence: "testtesttesttesttesttesttesttesttesttesttesttesttest",
        scheduleMinnutes: 20,
        actualMinutes: 23,
      };
      const res = await app.request("/api/post/1", {
        method: "PUT",
        body: JSON.stringify({
          sentence: invalidPost.sentence,
          scheduleMinnutes: invalidPost.scheduleMinnutes,
          actualMinutes: invalidPost.actualMinutes,
        }),
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Title is must be 20");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockUpdatePostUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const res = await app.request("/api/post/1", {
        method: "PUT",
        body: JSON.stringify({
          sentence: mockPost.sentence,
        }),
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to update post" });
    });
  });
});
