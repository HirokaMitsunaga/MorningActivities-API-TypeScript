import { Like } from "@prisma/client";
import { LikeEntity } from "../../../domain/like/likeEntity.js";
import { likeGatewayInterFace } from "./likeGateway.js";
import { LikeRepository } from "./likeRepository.js";

describe("likeRepository Test", () => {
  let mockLikeGateway: Partial<likeGatewayInterFace>;
  let likeRepository: LikeRepository;

  describe("likeRepository addLike", () => {
    //入力値
    const likeRepositoryInputData = {
      userId: 1,
      postId: 2,
    };
    //出力値
    const likeRepositoryOutputData = new LikeEntity(1, 1, 2);
    //モックの期待値
    const likeGatewayResult: Like = {
      id: 1,
      userId: 1,
      postId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    beforeEach(() => {
      mockLikeGateway = {
        addLike: jest.fn(),
      };
      likeRepository = new LikeRepository(
        mockLikeGateway as likeGatewayInterFace
      );
    });
    it("いいねができる", async () => {
      (mockLikeGateway.addLike as jest.Mock).mockReturnValue(likeGatewayResult);
      const like = await likeRepository.addLike(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
      expect(like).toEqual(likeRepositoryOutputData);
      expect(mockLikeGateway.addLike).toHaveBeenCalledWith(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
    });
    it("DB接続エラーで失敗する", async () => {
      (mockLikeGateway.addLike as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(mockLikeGateway.addLike).rejects.toThrow("Database error");
    });
  });
  describe("likeRepository getLike", () => {
    //入力値
    const likeRepositoryInputData = {
      userId: 1,
      postId: 2,
    };
    //出力値
    const likeRepositoryOutputData = new LikeEntity(1, 1, 2);
    //モックの期待値
    const likeGatewayResult: Like = {
      id: 1,
      userId: 1,
      postId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    beforeEach(() => {
      mockLikeGateway = {
        getLike: jest.fn(),
      };
      likeRepository = new LikeRepository(
        mockLikeGateway as likeGatewayInterFace
      );
    });
    it("いいねを取得できる", async () => {
      (mockLikeGateway.getLike as jest.Mock).mockReturnValue(likeGatewayResult);
      const like = await likeRepository.getLike(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
      expect(like).toEqual(likeRepositoryOutputData);
      expect(mockLikeGateway.getLike).toHaveBeenCalledWith(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
    });
    it("いいねが存在しない", async () => {
      (mockLikeGateway.getLike as jest.Mock).mockReturnValue(undefined);
      const like = await likeRepository.getLike(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
      expect(like).toBe(undefined);
      expect(mockLikeGateway.getLike).toHaveBeenCalledWith(
        likeRepositoryInputData.userId,
        likeRepositoryInputData.postId
      );
    });
  });
});
