import { Hono } from "hono";
import { CreatePostUsecase } from "../../application/usecase/post/createPostUsecase.js";
import { PostRepository } from "../../infrastructure/repository/post/postRepository.js";
import { PostEntity } from "../../domain/post/postEntity.js";
import { PostModel } from "../../validator/post.js";
import { ValidationError } from "../../validator/validationError.js";
import { authMiddleware } from "../../middleware/auth.js";
import { PostGateway } from "../../infrastructure/repository/post/postGateway.js";
import { PrismaClient } from "@prisma/client";
import { GetAllPostsUsecase } from "../../application/usecase/post/getAllPostsUsecase.js";
import { GetPostByIdUsecase } from "../../application/usecase/post/getPostByIdUsecase.js";
import { UpdatePostUsecase } from "../../application/usecase/post/updatePostUsecase.js";
import { DeletePostUsecase } from "../../application/usecase/post/deletePostUsecase.js";

const post = new Hono();
post.use("/post/*", authMiddleware);

const createPostUsecase = new CreatePostUsecase(
  new PostRepository(new PostGateway(new PrismaClient()))
);

const getAllPostsUsecase = new GetAllPostsUsecase(
  new PostRepository(new PostGateway(new PrismaClient()))
);

const getPostByIdUsecase = new GetPostByIdUsecase(
  new PostRepository(new PostGateway(new PrismaClient()))
);

const updatePostUsecase = new UpdatePostUsecase(
  new PostRepository(new PostGateway(new PrismaClient()))
);

const deletePostUsecase = new DeletePostUsecase(
  new PostRepository(new PostGateway(new PrismaClient()))
);

export type PostPostRequestBody = {
  sentence: string;
};

post.post("/post", async (c) => {
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
    const output = await createPostUsecase.run(
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

post.get("/post", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;

    const output = await getAllPostsUsecase.run(userId);
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

post.get("/post/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const postId = Number(c.req.param("id"));

    const output = await getPostByIdUsecase.run(userId, postId);
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

post.put("/post/:id", async (c) => {
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
    const output = await updatePostUsecase.run(
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

post.delete("/post/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId: number = payload.sub;
    const postId = Number(c.req.param("id"));

    await deletePostUsecase.run(userId, postId);

    return c.json({ success: `delete post id = ${postId}` }, 201);
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

export default post;
