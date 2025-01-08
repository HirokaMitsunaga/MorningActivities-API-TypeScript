import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class AddLikeUsecase {
  constructor(
    private _likeRepository: LikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number) {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostById(userId, postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      //一人のユーザが同じ投稿に2回いいねしたらドメインエラーにする
      const isLike = await this._likeRepository.getLike(userId, postId);
      if (isLike) {
        throw new DomainError("Only one like is allowed");
      }
      const like = await this._likeRepository.addLike(userId, postId);
      return like;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Unknown error occurred while add like");
    }
  }
}
