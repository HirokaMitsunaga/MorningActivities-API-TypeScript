import { CommentLikeEntity } from "../../../domain/commentLike/commentLikeEntity.js";
import { CommentLikeRepositoryInterface } from "../../../domain/commentLike/commentLikeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class AddCommentLikeUsecase {
  constructor(
    private _commentLikeRepository: CommentLikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number): Promise<CommentLikeEntity> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //一人のユーザが同じ投稿に2回いいねしたらドメインエラーにする
      const isCommentLike = await this._commentLikeRepository.getCommentLike(
        userId,
        postId
      );
      if (isCommentLike) {
        throw new DomainError("Only one commentLike is allowed");
      }
      const commentLike = await this._commentLikeRepository.addCommentLike(
        userId,
        postId
      );
      return commentLike;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Unknown error occurred while add commentLike");
    }
  }
}
