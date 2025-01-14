import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class DeleteLikeUsecase {
  constructor(
    private _likeRepository: LikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number, likeId: number): Promise<void> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //いいねしていない時はドメインエラーにする
      const like = await this._likeRepository.getLike(userId, postId);
      if (!like) {
        throw new DomainError("You have not liked this post");
      }
      // likeIdが一致するか確認
      if (like.id !== likeId) {
        throw new DomainError("Invalid like ID");
      }

      await this._likeRepository.deleteLike(likeId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
}
