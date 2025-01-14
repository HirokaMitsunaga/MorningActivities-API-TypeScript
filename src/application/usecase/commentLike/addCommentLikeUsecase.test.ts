import { CommentLikeEntity } from "../../../domain/commentLike/commentLikeEntity.js";
import { CommentLikeRepositoryInterface } from "../../../domain/commentLike/commentLikeRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";
import { AddCommentLikeUsecase } from "./addCommentLikeUsecase.js";

describe("addCommentLikeUsecsse Test", () => {
  let mockCommentLikeRepository: Partial<CommentLikeRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let addCommentLikeUsecase: AddCommentLikeUsecase;

  //入力データ
  const commentLikeData = {
    userId: 1,
    postId: 2,
  };

  //正常系
  const postResult = new PostEntity(1, "テスト", 3);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //commentLikeをすでにしている
  const commentLikeDuplicationResult = new CommentLikeEntity(1, 1, 2);

  beforeEach(() => {
    mockCommentLikeRepository = {
      addCommentLike: jest.fn(),
      getCommentLike: jest.fn(),
    };
    mockPostRepository = {
      getPostByOnlyPostId: jest.fn(),
    };

    addCommentLikeUsecase = new AddCommentLikeUsecase(
      mockCommentLikeRepository as CommentLikeRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("いいねができる", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        undefined
      );
      const commentLikeResult = await addCommentLikeUsecase.run(
        commentLikeData.userId,
        commentLikeData.postId
      );
      expect(commentLikeResult).toEqual(commentLikeResult);
      expect(mockCommentLikeRepository.getCommentLike).toHaveBeenCalledWith(
        commentLikeData.userId,
        commentLikeData.postId
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
        undefined
      );
      await expect(
        addCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId
        )
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("同じユーザが一つの投稿へ2回いいねをしたらドメインエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        commentLikeDuplicationResult
      );
      await expect(
        addCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId
        )
      ).rejects.toThrow(new DomainError("Only one commentLike is allowed"));
    });
    it("DBエラーでいいねが失敗する", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postResult
      );
      (mockCommentLikeRepository.getCommentLike as jest.Mock).mockReturnValue(
        undefined
      );
      const commentLikeResult = await addCommentLikeUsecase.run(
        commentLikeData.userId,
        commentLikeData.postId
      );
      (
        mockCommentLikeRepository.addCommentLike as jest.Mock
      ).mockRejectedValueOnce(new Error("Database error"));
      await expect(
        addCommentLikeUsecase.run(
          commentLikeData.userId,
          commentLikeData.postId
        )
      ).rejects.toThrow("Database error");
    });
  });
});
