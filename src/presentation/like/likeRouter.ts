import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { AddLikeUsecase } from "../../application/usecase/like/addLikeUsecase.js";
import { LikeRepository } from "../../infrastructure/repository/like/likeRepository.js";
import { likeGateway } from "../../infrastructure/repository/like/likeGateway.js";
import { PrismaClient } from "@prisma/client";
import { DeleteLikeUsecase } from "../../application/usecase/like/deleteLikeUsecase.js";
import { ValidationError } from "../../validator/validationError.js";
import { PostRepository } from "../../infrastructure/repository/post/postRepository.js";
import { PostGateway } from "../../infrastructure/repository/post/postGateway.js";

const like = new Hono();
like.use("/like/*", authMiddleware);

const addLikeUsecase = new AddLikeUsecase(
  new LikeRepository(new likeGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

const deleteLikeUsecase = new DeleteLikeUsecase(
  new LikeRepository(new likeGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

export type LikePostRequestBody = {
  postId: number;
};

like.post("/like", async (c) => {
  try {
    const postData = await c.req.json<LikePostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    //バリデーション
    const output = await addLikeUsecase.run(userId, postData.postId);

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
    return c.json({ error: "Failed to create post" }, 500);
  }
});

like.delete("/like/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const likeId = Number(c.req.param("id"));

    await deleteLikeUsecase.run(userId, likeId);

    return c.json({ success: `delete post id = ${likeId}` }, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default like;
