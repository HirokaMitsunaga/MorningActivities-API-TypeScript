import { LikeEntity } from "../../../domain/like/likeEntity.js";
import { LikeRepositoryInterface } from "../../../domain/like/likeRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { DomainError } from "../../../validator/domainError.js";
import { ValidationError } from "../../../validator/validationError.js";
import { AddLikeUsecase } from "./addLikeUsecase.js";

describe("addLikeUsecsse Test", () => {
  let mockLikeRepository: Partial<LikeRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let addLikeUsecase: AddLikeUsecase;

  //入力データ
  const likeData = {
    userId: 1,
    postId: 2,
  };

  //正常系
  const postResult = new PostEntity(1, "テスト", 3);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //likeをすでにしている
  const likeDuplicationResult = new LikeEntity(1, 1, 2);

  beforeEach(() => {
    mockLikeRepository = {
      addLike: jest.fn(),
      getLike: jest.fn(),
    };
    mockPostRepository = {
      getPostById: jest.fn(),
    };

    addLikeUsecase = new AddLikeUsecase(
      mockLikeRepository as LikeRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("いいねができる", async () => {
      (mockPostRepository.getPostById as jest.Mock).mockReturnValue(postResult);
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(undefined);
      const likeResult = await addLikeUsecase.run(
        likeData.userId,
        likeData.postId
      );
      expect(likeResult).toEqual(likeResult);
      expect(mockLikeRepository.getLike).toHaveBeenCalledWith(
        likeData.userId,
        likeData.postId
      );
      expect(mockPostRepository.getPostById).toHaveBeenCalledWith(
        likeData.userId,
        likeData.postId
      );
    });
  });
  describe("異常系", () => {
    it("いいねしたい投稿が見つからない時、バリデーションエラーを返す", async () => {
      (mockPostRepository.getPostById as jest.Mock).mockReturnValue(
        postNotFoundResult
      );
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(undefined);
      await expect(
        addLikeUsecase.run(likeData.userId, likeData.postId)
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("同じユーザが一つの投稿へ2回いいねをしたらドメインエラーを返す", async () => {
      (mockPostRepository.getPostById as jest.Mock).mockReturnValue(postResult);
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(
        likeDuplicationResult
      );
      await expect(
        addLikeUsecase.run(likeData.userId, likeData.postId)
      ).rejects.toThrow(new DomainError("Only one like is allowed"));
    });
    it("DBエラーでいいねが失敗する", async () => {
      (mockPostRepository.getPostById as jest.Mock).mockReturnValue(postResult);
      (mockLikeRepository.getLike as jest.Mock).mockReturnValue(undefined);
      const likeResult = await addLikeUsecase.run(
        likeData.userId,
        likeData.postId
      );
      (mockLikeRepository.addLike as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        addLikeUsecase.run(likeData.userId, likeData.postId)
      ).rejects.toThrow("Database error");
    });
  });
});
