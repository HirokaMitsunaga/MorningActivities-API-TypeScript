import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { AddCommentLikeUsecase } from "../../application/usecase/commentLike/addCommentLikeUsecase.js";
import { CommentLikeRepository } from "../../infrastructure/repository/commentLike/commentLikeRepository.js";
import { CommentLikeGateway } from "../../infrastructure/repository/commentLike/commentLikeGateway.js";
import { PrismaClient } from "@prisma/client";
import { DeleteCommentLikeUsecase } from "../../application/usecase/commentLike/deleteCommentLikeUsecase.js";
import { ValidationError } from "../../validator/validationError.js";
import { PostRepository } from "../../infrastructure/repository/post/postRepository.js";
import { PostGateway } from "../../infrastructure/repository/post/postGateway.js";
import { DomainError } from "../../validator/domainError.js";

const commentLike = new Hono();
commentLike.use("/comment-like/*", authMiddleware);

const addCommentLikeUsecase = new AddCommentLikeUsecase(
  new CommentLikeRepository(new CommentLikeGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

const deleteCommentLikeUsecase = new DeleteCommentLikeUsecase(
  new CommentLikeRepository(new CommentLikeGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

export type CommentLikePostRequestBody = {
  commentId: number;
};

commentLike.post("/comment-like", async (c) => {
  try {
    const postData = await c.req.json<CommentLikePostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    //バリデーション
    const output = await addCommentLikeUsecase.run(userId, postData.commentId);

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

commentLike.delete("/comment-like/:id", async (c) => {
  try {
    const postData = await c.req.json<CommentLikePostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const commentLikeId = Number(c.req.param("id"));

    await deleteCommentLikeUsecase.run(
      userId,
      postData.commentId,
      commentLikeId
    );

    return c.json({ success: `delete post id = ${commentLikeId}` }, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof DomainError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default commentLike;
