import { LikeEntity } from "../../../domain/like/likeEntity.js";
import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";
import { DeleteLikeUsecase } from "./deleteLikeUsecase.js";

describe("deleteLikeUsecsse Test", () => {
  let mockLikeRepository: Partial<LikeRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let deleteLikeUsecase: DeleteLikeUsecase;

  //入力データ
  const likeData = {
    userId: 1,
    postId: 2,
    likeId: 1,
  };

  //正常系
  const postFoundResult = new PostEntity(1, "テスト", 3);
  const likeFoundResult = new LikeEntity(1, 1, 2);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //likeが見つからない
  const likeNotFoundResult = undefined;

  beforeEach(() => {
    mockLikeRepository = {
      deleteLike: jest.fn(),
      getLike: jest.fn(),
    };
    mockPostRepository = {
      getPostByOnlyPostId: jest.fn(),
    };

    deleteLikeUsecase = new DeleteLikeUsecase(
      mockLikeRepository as LikeRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("いいねが削除できる", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(
        likeFoundResult
      );
      const likeResult = await deleteLikeUsecase.run(
        likeData.userId,
        likeData.postId,
        likeData.likeId
      );
      expect(likeResult).toEqual(undefined);
      expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
        likeData.postId
      );
      expect(mockPostRepository.getPostByOnlyPostId).toHaveBeenCalledWith(
        likeData.postId
      );
    });
  });
  describe("異常系", () => {
    it("いいねしたい投稿が見つからない時、バリデーションエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postNotFoundResult
      );
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(
        likeFoundResult
      );
      await expect(
        deleteLikeUsecase.run(likeData.userId, likeData.postId, likeData.likeId)
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("いいねしていないのに削除しようとした時、ドメインエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockLikeRepository.deleteLike as jest.Mock).mockReturnValue(
        likeNotFoundResult
      );
      await expect(
        deleteLikeUsecase.run(likeData.userId, likeData.postId, likeData.likeId)
      ).rejects.toThrow(new DomainError("You have not liked this post"));
    });
    it("DBエラーでいいねが失敗する", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postFoundResult
      );
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(
        likeFoundResult
      );
      (mockLikeRepository.deleteLike as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        deleteLikeUsecase.run(likeData.userId, likeData.postId, likeData.likeId)
      ).rejects.toThrow("Database error");
    });
  });
});
