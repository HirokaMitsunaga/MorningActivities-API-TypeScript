import { LikeEntity } from "./likeEntity.js";

export interface LikeRepositoryInterface {
  addLike(userId: number, postId: number): Promise<LikeEntity>;
  getLike(userId: number, likeId: number): Promise<LikeEntity | undefined>;
  deleteLike(postid: number): Promise<void>;
}
