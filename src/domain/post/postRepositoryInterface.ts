import { PostEntity } from "./postEntity.js";

export interface PostRepositoryInterface {
  createPost(post: PostEntity): Promise<PostEntity>;
  getAllPosts(userId: number): Promise<PostEntity[] | undefined>;
  getPostById(userId: number, postId: number): Promise<PostEntity | undefined>;
  updatePost(post: PostEntity): Promise<PostEntity>;
  deletePost(userId: number, postId: number): Promise<void>;
}
