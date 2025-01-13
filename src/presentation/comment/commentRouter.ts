import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { AddCommentUsecase } from "../../application/usecase/comment/addCommentUsecase.js";
import { CommentRepository } from "../../infrastructure/repository/comment/commentRepository.js";
import { CommentGateway } from "../../infrastructure/repository/comment/commentGateway.js";
import { PrismaClient } from "@prisma/client";
import { DeleteCommentUsecase } from "../../application/usecase/comment/deleteCommentUsecase.js";
import { ValidationError } from "../../validator/validationError.js";
import { PostRepository } from "../../infrastructure/repository/post/postRepository.js";
import { PostGateway } from "../../infrastructure/repository/post/postGateway.js";
import { DomainError } from "../../validator/domainError.js";

const comment = new Hono();
comment.use("/comment/*", authMiddleware);

const addCommentUsecase = new AddCommentUsecase(
  new CommentRepository(new CommentGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

const deleteCommentUsecase = new DeleteCommentUsecase(
  new CommentRepository(new CommentGateway(new PrismaClient())),
  new PostRepository(new PostGateway(new PrismaClient()))
);

export type CommentPostRequestBody = {
  postId: number;
  comment: string;
};

comment.post("/comment", async (c) => {
  try {
    const postData = await c.req.json<CommentPostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    //バリデーション
    const output = await addCommentUsecase.run(
      userId,
      postData.postId,
      postData.comment
    );

    const responseBody = {
      id: output.id,
      userId: output.userId,
      postId: output.postId,
      comment: output.comment,
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

comment.delete("/comment/:id", async (c) => {
  try {
    const postData = await c.req.json<CommentPostRequestBody>();
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const commentId = Number(c.req.param("id"));

    await deleteCommentUsecase.run(userId, postData.postId, commentId);

    return c.json({ success: `delete post id = ${commentId}` }, 201);
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

export default comment;
