import { Hono } from "hono";
import { testClient } from "hono/testing";
import { ValidationError } from "../../validator/validationError.js";
import { PostEntity } from "../../domain/post/postEntity.js";

describe("getPostById test", () => {
  let mockGetPostByIdUsecase: {
    run: jest.Mock<Promise<PostEntity | undefined>, [number, number]>;
  };
  const postData = {
    userId: 1,
    postId: 1,
  };
  //mockGetPostByIdUsecaseの引数
  const mockPost = new PostEntity(undefined, "test", 1);
  //mockGetPostByIdUsecaseの戻り値
  const expectedPost = new PostEntity(1, "test", 1);

  const app = new Hono()
    .use("*", async (c, next) => {
      c.set("jwtPayload", { sub: 1 });
      await next();
    })
    .get("/api/post/:id", async (c) => {
      try {
        const payload = c.get("jwtPayload");
        const userId: number = payload.sub;
        const postId = Number(c.req.param("id"));

        const output = await mockGetPostByIdUsecase.run(userId, postId);
        if (!output) {
          return c.json({ error: "Not found post" }, 400);
        }

        return c.json(output, 201);
      } catch (error) {
        if (error instanceof ValidationError) {
          return c.json({ error: error.message }, 400);
        }
        return c.json({ error: "Failed to found to get post by id" }, 500);
      }
    });

  describe("getAllPosts", () => {
    beforeEach(() => {
      mockGetPostByIdUsecase = {
        run: jest.fn(),
      };
    });

    it("ステータスコード201を返すこと", async () => {
      mockGetPostByIdUsecase.run.mockResolvedValue(expectedPost);

      const client = testClient(app);
      const res = await client.api.post[":id"].$get({
        param: {
          id: postData.postId.toString(),
        },
      });
      expect(res.status).toBe(201);
      expect(mockGetPostByIdUsecase.run).toHaveBeenCalledWith(
        postData.userId,
        postData.postId
      );
      expect(await res.json()).toEqual(expectedPost);
    });

    it("タスクが存在しない時は400を返すこと", async () => {
      mockGetPostByIdUsecase.run.mockResolvedValue(undefined);

      const client = testClient(app);
      const res = await client.api.post[":id"].$get({
        param: {
          id: postData.postId.toString(),
        },
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Not found post");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockGetPostByIdUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.post[":id"].$get({
        param: {
          id: postData.postId.toString(),
        },
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to found to get post by id" });
    });
  });
});
