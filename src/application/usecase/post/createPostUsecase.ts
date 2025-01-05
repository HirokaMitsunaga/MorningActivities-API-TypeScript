import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";

export class CreatePostUsecase {
  constructor(private _postRepository: PostRepositoryInterface) {}
  async run(post: PostEntity): Promise<PostEntity> {
    try {
      const PostRes = await this._postRepository.createPost(post);
      return PostRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while create post");
    }
  }
}
