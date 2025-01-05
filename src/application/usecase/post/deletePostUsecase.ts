import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";

export class DeletePostUsecase {
  constructor(private _postRepository: PostRepositoryInterface) {}
  async run(userId: number, postId: number): Promise<void> {
    try {
      const existingPost = await this._postRepository.getPostById(
        userId,
        postId
      );
      if (!existingPost) {
        throw new Error("Post not found");
      }

      await this._postRepository.deletePost(userId, postId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete post");
    }
  }
}
