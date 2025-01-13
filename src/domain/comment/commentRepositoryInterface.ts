import { CommentEntity } from "./commentEntity.js";

export interface CommentRepositoryInterface {
  addComment(userId: number, postId: number): Promise<CommentEntity>;
  getComment(
    userId: number,
    commentId: number
  ): Promise<CommentEntity | undefined>;
  deleteComment(postid: number): Promise<void>;
}
