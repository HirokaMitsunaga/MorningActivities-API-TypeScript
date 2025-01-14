import { CommentLikeRepositoryInterface } from "../../../domain/commentLike/commentLikeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class DeleteCommentLikeUsecase {
  constructor(
    private _commentLikeRepository: CommentLikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(
    userId: number,
    commentId: number,
    commentLikeId: number
  ): Promise<void> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(commentId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //いいねしていない時はドメインエラーにする
      const commentLike = await this._commentLikeRepository.getCommentLike(
        userId,
        commentId
      );
      if (!commentLike) {
        throw new DomainError("You have not commentLiked this post");
      }
      // commentLikeIdが一致するか確認
      if (commentLike.id !== commentLikeId) {
        throw new DomainError("Invalid commentLike ID");
      }

      await this._commentLikeRepository.deleteCommentLike(commentLikeId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete commentLike");
    }
  }
}
