import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";

export class AddLikeUsecase {
  constructor(private _likeRepository: LikeRepositoryInterface) {}
  async run(userId: number, postId: number) {
    try {
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
