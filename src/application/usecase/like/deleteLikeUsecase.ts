import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";

export class DeleteLikeUsecase {
  constructor(private _likeRepository: LikeRepositoryInterface) {}
  async run(postId: number): Promise<void> {
    try {
      await this._likeRepository.deleteLike(postId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
}
