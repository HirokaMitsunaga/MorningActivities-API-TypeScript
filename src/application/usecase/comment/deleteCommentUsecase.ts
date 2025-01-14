import { CommentRepositoryInterface } from "../../../domain/comment/commentRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class DeleteCommentUsecase {
  constructor(
    private _commentRepository: CommentRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number, commentId: number): Promise<void> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //コメントしていない時はドメインエラーにする
      const comment = await this._commentRepository.getComment(userId, postId);
      if (!comment) {
        throw new DomainError("You have not commentd this post");
      }
      //コメントIDが一致していない場合はエラーにする
      if (comment.id !== commentId) {
        throw new DomainError("Invalid comment id");
      }

      await this._commentRepository.deleteComment(commentId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete comment");
    }
  }
}
