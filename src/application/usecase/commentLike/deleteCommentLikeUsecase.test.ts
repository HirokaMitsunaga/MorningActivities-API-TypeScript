import { CommentLikeEntity } from "../../../domain/commentLike/commentLikeEntity.js";
import { CommentLikeRepositoryInterface } from "../../../domain/commentLike/commentLikeRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";
import { DeleteCommentLikeUsecase } from "./deleteCommentLikeUsecase.js";

describe("deleteCommentLikeUsecsse Test", () => {
  let mockCommentLikeRepository: Partial<CommentLikeRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let deleteCommentLikeUsecase: DeleteCommentLikeUsecase;

  //入力データ
  const commentLikeData = {
    userId: 1,
    postId: 2,
    commentLikeId: 1,
  };

  //正常系
  const postFoundResult = new PostEntity(1, "テスト", 3);
  const commentLikeFoundResult = new CommentLikeEntity(1, 1, 2);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //commentLikeが見つからない
  const commentLikeNotFoundResult = undefined;

  beforeEach(() => {
    mockCommentLikeRepository = {
      deleteCommentLike: jest.fn(),
      getCommentLike: jest.fn(),
    };
    mockPostRepository = {
      getPostByOnlyPostId: jest.fn(),
    };

    deleteCommentLikeUsecase = new DeleteCommentLikeUsecase(
      mockCommentLikeRepository as CommentLikeRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("いいねが削除できる", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        commentLikeFoundResult
      );
      const commentLikeResult = await deleteCommentLikeUsecase.run(
        commentLikeData.userId,
        commentLikeData.postId,
        commentLikeData.commentLikeId
      );
      expect(commentLikeResult).toEqual(undefined);
      expect(mockCommentLikeRepository.deleteCommentLike).toHaveBeenCalledWith(
        commentLikeData.commentLikeId
      );
      expect(mockPostRepository.getPostByOnlyPostId).toHaveBeenCalledWith(
        commentLikeData.postId
      );
    });
  });
  describe("異常系", () => {
    it("いいねしたい投稿が見つからない時、バリデーションエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postNotFoundResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        commentLikeFoundResult
      );
      await expect(
        deleteCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId,
          commentLikeData.commentLikeId
        )
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("いいねしていないのに削除しようとした時、ドメインエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (
        mockCommentLikeRepository.deleteCommentLike as jest.Mock
      ).mockReturnValue(commentLikeNotFoundResult);
      await expect(
        deleteCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId,
          commentLikeData.commentLikeId
        )
      ).rejects.toThrow(new DomainError("You have not commentLiked this post"));
    });
    it("DBエラーでいいねが失敗する", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        commentLikeFoundResult
      );
      (
        mockCommentLikeRepository.deleteCommentLike as jest.Mock
      ).mockRejectedValueOnce(new Error("Database error"));
      await expect(
        deleteCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId,
          commentLikeData.commentLikeId
        )
      ).rejects.toThrow("Database error");
    });
  });
});
