import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";

export class UpdatePostUsecase {
  constructor(private _postRepository: PostRepositoryInterface) {}
  async run(post: PostEntity): Promise<PostEntity> {
    try {
      if (typeof post.id !== "number") {
        throw new Error("postId is required and must be a number");
      }
      const PostRes = await this._postRepository.updatePost(post);
      return PostRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while update post");
    }
  }
}
