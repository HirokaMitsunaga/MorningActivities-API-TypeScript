import { LikeEntity } from "../../../domain/like/likeEntity.js";
import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { likeGatewayInterFace } from "./likeGateway.js";

export class LikeRepository implements LikeRepositoryInterface {
  constructor(private _likeGateway: likeGatewayInterFace) {}

  async addLike(userId: number, postId: number): Promise<LikeEntity> {
    try {
      const likeRes = await this._likeGateway.addLike(userId, postId);

      return new LikeEntity(likeRes.id, likeRes.userId, likeRes.postId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
  async deleteLike(postid: number): Promise<void> {
    try {
      await this._likeGateway.deleteLike(postid);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
}
