import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class DeleteLikeUsecase {
  constructor(
    private _likeRepository: LikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number): Promise<void> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //いいねしていない時はドメインエラーにする
      const isLike = await this._likeRepository.getLike(userId, postId);
      if (!isLike) {
        throw new DomainError("You have not liked this post");
      }

      await this._likeRepository.deleteLike(postId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
}
