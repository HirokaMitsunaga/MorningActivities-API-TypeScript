import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { CommentRepositoryInterface } from "../../../domain/comment/commentRepositoryInterface.js";
import { commentGatewayInterFace } from "./commentGateway.js";

export class CommentRepository implements CommentRepositoryInterface {
  constructor(private _commentGateway: commentGatewayInterFace) {}

  async addComment(userId: number, postId: number): Promise<CommentEntity> {
    try {
      const commentRes = await this._commentGateway.addComment(userId, postId);

      return new CommentEntity(
        commentRes.id,
        commentRes.userId,
        commentRes.postId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete comment");
    }
  }
  async getComment(
    userId: number,
    postId: number
  ): Promise<CommentEntity | undefined> {
    try {
      const commentRes = await this._commentGateway.getComment(userId, postId);
      if (!commentRes) {
        return undefined;
      }
      return new CommentEntity(
        commentRes.id,
        commentRes.userId,
        commentRes.postId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get comment");
    }
  }

  async deleteComment(postid: number): Promise<void> {
    try {
      await this._commentGateway.deleteComment(postid);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete comment");
    }
  }
}