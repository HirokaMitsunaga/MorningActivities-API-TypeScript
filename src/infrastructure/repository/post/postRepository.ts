import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { PostGatewayInterface } from "./postGateway.js";

export class PostRepository implements PostRepositoryInterface {
  constructor(private _postGateway: PostGatewayInterface) {}
  async createPost(post: PostEntity): Promise<PostEntity> {
    try {
      const postRes = await this._postGateway.createPost(
        post.sentence,
        post.userId
      );
      return new PostEntity(postRes.id, postRes.sentence, postRes.userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create post");
    }
  }
  async getAllPosts(userId: number): Promise<PostEntity[] | undefined> {
    try {
      const postsRes = await this._postGateway.getAllPosts(userId);
      if (!postsRes) {
        return undefined;
      }
      return postsRes.map(
        (postRes) =>
          new PostEntity(postRes.id, postRes.sentence, postRes.userId)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create post");
    }
  }
  async getPostById(
    userId: number,
    postId: number
  ): Promise<PostEntity | undefined> {
    try {
      const postRes = await this._postGateway.getPostById(userId, postId);
      if (!postRes) {
        return undefined;
      }
      return new PostEntity(postRes.id, postRes.sentence, postRes.userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get post by id");
    }
  }
  async updatePost(post: PostEntity): Promise<PostEntity> {
    try {
      if (typeof post.id !== "number") {
        throw new Error("postId is required and must be a number");
      }
      const postRes = await this._postGateway.updatePost(
        post.id,
        post.sentence,
        post.userId
      );

      return new PostEntity(postRes.id, postRes.sentence, postRes.userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get post by id");
    }
  }
  async deletePost(userId: number, postId: number): Promise<void> {
    try {
      await this._postGateway.deletePost(userId, postId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete post");
    }
  }
}
