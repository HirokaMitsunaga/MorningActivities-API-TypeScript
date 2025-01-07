import { LikeEntity } from "./likeEntity.js";

export interface LikeRepositoryInterface {
  addLike(userId: number, postId: number): Promise<LikeEntity>;
  deleteLike(postid: number): Promise<void>;
}
