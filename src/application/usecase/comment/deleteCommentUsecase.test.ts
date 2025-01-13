import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { CommentRepositoryInterface } from "../../../domain/comment/commentRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";
import { DeleteCommentUsecase } from "./deleteCommentUsecase.js";

describe("deleteCommentUsecsse Test", () => {
  let mockCommentRepository: Partial<CommentRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let deleteCommentUsecase: DeleteCommentUsecase;

  //入力データ
  const commentData = {
    userId: 1,
    postId: 2,
  };

  //正常系
  const postFoundResult = new PostEntity(1, "test", 3);
  const commentFoundResult = new CommentEntity(1, "test", 1, 2);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //commentが見つからない
  const commentNotFoundResult = undefined;

  beforeEach(() => {
    mockCommentRepository = {
      deleteComment: jest.fn(),
      getComment: jest.fn(),
    };
    mockPostRepository = {
      getPostByOnlyPostId: jest.fn(),
    };

    deleteCommentUsecase = new DeleteCommentUsecase(
      mockCommentRepository as CommentRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("コメントが削除できる", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        commentFoundResult
      );
      const commentResult = await deleteCommentUsecase.run(
        commentData.userId,
        commentData.postId
      );
      expect(commentResult).toEqual(undefined);
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
        commentData.postId
      );
      expect(mockPostRepository.getPostByOnlyPostId).toHaveBeenCalledWith(
        commentData.postId
      );
    });
  });
  describe("異常系", () => {
    it("コメントしたい投稿が見つからない時、バリデーションエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postNotFoundResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        commentFoundResult
      );
      await expect(
        deleteCommentUsecase.run(commentData.userId, commentData.postId)
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("コメントしていないのに削除しようとした時、ドメインエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockCommentRepository.deleteComment as jest.Mock).mockReturnValue(
        commentNotFoundResult
      );
      await expect(
        deleteCommentUsecase.run(commentData.userId, commentData.postId)
      ).rejects.toThrow(new DomainError("You have not commentd this post"));
    });
    it("DBエラーでコメントが失敗する", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        commentFoundResult
      );
      (mockCommentRepository.deleteComment as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        deleteCommentUsecase.run(commentData.userId, commentData.postId)
      ).rejects.toThrow("Database error");
    });
  });
});
