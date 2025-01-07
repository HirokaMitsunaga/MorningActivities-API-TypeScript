import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { ValidationError } from "../../../validator/validationError.js";

export class AddLikeUsecase {
  constructor(
    private _likeRepository: LikeRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number) {
    try {
      const post = await this._postRepository.getPostById(userId, postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }
      const like = await this._likeRepository.addLike(userId, postId);
      return like;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while add like");
    }
  }
}
