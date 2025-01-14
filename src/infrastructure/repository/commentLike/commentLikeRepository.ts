import { CommentLikeEntity } from "../../../domain/commentLike/commentLikeEntity.js";
import { CommentLikeRepositoryInterface } from "../../../domain/commentLike/commentLikeRepositoryInterface.js";
import { commentLikeGatewayInterFace } from "./commentLikeGateway.js";

export class CommentLikeRepository implements CommentLikeRepositoryInterface {
  constructor(private _commentLikeGateway: commentLikeGatewayInterFace) {}

  async addCommentLike(
    userId: number,
    commentId: number
  ): Promise<CommentLikeEntity> {
    try {
      const commentLikeRes = await this._commentLikeGateway.addCommentLike(
        userId,
        commentId
      );

      return new CommentLikeEntity(
        commentLikeRes.id,
        commentLikeRes.userId,
        commentLikeRes.commentId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete commentLike");
    }
  }
  async getCommentLike(
    userId: number,
    commentId: number
  ): Promise<CommentLikeEntity | undefined> {
    try {
      const commentLikeRes = await this._commentLikeGateway.getCommentLike(
        userId,
        commentId
      );
      if (!commentLikeRes) {
        return undefined;
      }
      return new CommentLikeEntity(
        commentLikeRes.id,
        commentLikeRes.userId,
        commentLikeRes.commentId
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get commentLike");
    }
  }

  async deleteCommentLike(commentLikeId: number): Promise<void> {
    try {
      await this._commentLikeGateway.deleteCommentLike(commentLikeId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete commentLike");
    }
  }
}
