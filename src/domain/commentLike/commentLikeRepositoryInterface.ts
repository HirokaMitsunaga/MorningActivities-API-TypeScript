import { CommentLikeEntity } from "./commentLikeEntity.js";

export interface CommentLikeRepositoryInterface {
  addCommentLike(userId: number, commentId: number): Promise<CommentLikeEntity>;
  getCommentLike(
    userId: number,
    commentLikeId: number
  ): Promise<CommentLikeEntity | undefined>;
  deleteCommentLike(commentLikeId: number): Promise<void>;
}
