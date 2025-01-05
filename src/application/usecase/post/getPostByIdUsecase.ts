import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";

export class GetPostByIdUsecase {
  constructor(private _postRepository: PostRepositoryInterface) {}
  async run(userId: number, postId: number): Promise<PostEntity | undefined> {
    try {
      const postRes = await this._postRepository.getPostById(userId, postId);
      if (!postRes) {
        return undefined;
      }
      return postRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get post by id");
    }
  }
}
