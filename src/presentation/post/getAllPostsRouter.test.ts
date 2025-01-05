import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { PostEntity } from "../../domain/post/postEntity.js";

describe("getAllPosts test", () => {
  let mockGetAllPostsUsecase: {
    run: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
  };
  const postData = {
    userId: 1,
    postId: 1,
  };
  //mockGetAllPostsUsecaseの引数
  const mockPost = new PostEntity(undefined, "test", 1);
  //mockGetAllPostsUsecaseの戻り値
  const expectedPost = new PostEntity(1, "test", 1);
  const expectedPosts = [
    new PostEntity(expectedPost.id, expectedPost.sentence, expectedPost.userId),
  ];

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .get("/api/post", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;

        const output = await mockGetAllPostsUsecase.run(userId);
        if (!output) {
          return c.json({ error: "Not found posts" }, 400);
        }

        return c.json(output, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to found posts" }, 500);
      }
    });

  describe("getAllPosts", () => {
    beforeEach(() => {
      mockGetAllPostsUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockGetAllPostsUsecase.run.mockResolvedValue(expectedPosts);

      const client = testClient(app);
      const res = await client.api.post.$get({
        json: postData.userId,
      });

      expect(res.status).toBe(201);
      expect(mockGetAllPostsUsecase.run).toHaveBeenCalledWith(postData.userId);
      expect(await res.json()).toEqual(expectedPosts);
    });

    it("タスクが存在しない時は400を返すこと", async () => {
      mockGetAllPostsUsecase.run.mockResolvedValue(undefined);

      const client = testClient(app);
      const res = await client.api.post.$get({
        json: postData.userId,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Not found posts");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockGetAllPostsUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.post.$get({
        json: postData.userId,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to found posts" });
    });
  });
});
