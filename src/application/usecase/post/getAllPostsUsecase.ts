import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";

export class GetAllPostsUsecase {
  constructor(private _postRepository: PostRepositoryInterface) {}
  async run(userId: number): Promise<PostEntity[] | undefined> {
    try {
      const PostsRes = await this._postRepository.getAllPosts(userId);
      if (!PostsRes) {
        return undefined;
      }
      return PostsRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get all posts");
    }
  }
}
