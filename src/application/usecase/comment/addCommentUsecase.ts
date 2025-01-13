import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { CommentRepositoryInterface } from "../../../domain/comment/commentRepositoryInterface.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";

export class AddCommentUsecase {
  constructor(
    private _commentRepository: CommentRepositoryInterface,
    private _postRepository: PostRepositoryInterface
  ) {}
  async run(userId: number, postId: number): Promise<CommentEntity> {
    try {
      //ポストがない時はバリデーションエラーを返す
      const post = await this._postRepository.getPostByOnlyPostId(postId);
      if (!post) {
        throw new ValidationError("Not found post");
      }

      const comment = await this._commentRepository.addComment(userId, postId);
      return comment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Unknown error occurred while add comment");
    }
  }
}
