import { CommentLike } from "@prisma/client";
import { CommentLikeEntity } from "../../../domain/commentLike/commentLikeEntity.js";
import { commentLikeGatewayInterFace } from "./commentLikeGateway.js";
import { CommentLikeRepository } from "./commentLikeRepository.js";

describe("commentLikeRepository Test", () => {
  let mockCommentLikeGateway: Partial<commentLikeGatewayInterFace>;
  let commentLikeRepository: CommentLikeRepository;
  //入力値
  const commentLikeRepositoryInputData = {
    userId: 1,
    commentId: 2,
    commentLikeId: 1,
  };
  //出力値
  const commentLikeRepositoryOutputData = new CommentLikeEntity(1, 1, 2);
  //モックの期待値
  const commentLikeGatewayResult: CommentLike = {
    id: 1,
    userId: 1,
    commentId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("commentLikeRepository addCommentLike", () => {
    beforeEach(() => {
      mockCommentLikeGateway = {
        addCommentLike: jest.fn(),
      };
      commentLikeRepository = new CommentLikeRepository(
        mockCommentLikeGateway as commentLikeGatewayInterFace
      );
    });
    it("いいねができる", async () => {
      (mockCommentLikeGateway.addCommentLike as jest.Mock).mockReturnValue(
        commentLikeGatewayResult
      );
      const commentLike = await commentLikeRepository.addCommentLike(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
      expect(commentLike).toEqual(commentLikeRepositoryOutputData);
      expect(mockCommentLikeGateway.addCommentLike).toHaveBeenCalledWith(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
    });
    it("DB接続エラーで失敗する", async () => {
      (
        mockCommentLikeGateway.addCommentLike as jest.Mock
      ).mockRejectedValueOnce(new Error("Database error"));
      await expect(mockCommentLikeGateway.addCommentLike).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("commentLikeRepository getCommentLike", () => {
    beforeEach(() => {
      mockCommentLikeGateway = {
        getCommentLike: jest.fn(),
      };
      commentLikeRepository = new CommentLikeRepository(
        mockCommentLikeGateway as commentLikeGatewayInterFace
      );
    });
    it("いいねを取得できる", async () => {
      (mockCommentLikeGateway.getCommentLike as jest.Mock).mockReturnValue(
        commentLikeGatewayResult
      );
      const commentLike = await commentLikeRepository.getCommentLike(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
      expect(commentLike).toEqual(commentLikeRepositoryOutputData);
      expect(mockCommentLikeGateway.getCommentLike).toHaveBeenCalledWith(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
    });
    it("いいねが存在しない", async () => {
      (mockCommentLikeGateway.getCommentLike as jest.Mock).mockReturnValue(
        undefined
      );
      const commentLike = await commentLikeRepository.getCommentLike(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
      expect(commentLike).toEqual(undefined);
      expect(mockCommentLikeGateway.getCommentLike).toHaveBeenCalledWith(
        commentLikeRepositoryInputData.userId,
        commentLikeRepositoryInputData.commentId
      );
    });
  });
  describe("commentLikeRepository deleteCommentLike", () => {
    beforeEach(() => {
      mockCommentLikeGateway = {
        deleteCommentLike: jest.fn(),
      };
      commentLikeRepository = new CommentLikeRepository(
        mockCommentLikeGateway as commentLikeGatewayInterFace
      );
    });
    it("いいねの削除ができる", async () => {
      (mockCommentLikeGateway.deleteCommentLike as jest.Mock).mockReturnValue(
        commentLikeGatewayResult
      );
      const commentLike = await commentLikeRepository.deleteCommentLike(
        commentLikeRepositoryInputData.commentLikeId
      );
      expect(commentLike).toEqual(undefined);
      expect(mockCommentLikeGateway.deleteCommentLike).toHaveBeenCalledWith(
        commentLikeRepositoryInputData.commentLikeId
      );
    });
    it("DB接続エラーで失敗する", async () => {
      (
        mockCommentLikeGateway.deleteCommentLike as jest.Mock
      ).mockRejectedValueOnce(new Error("Database error"));
      await expect(mockCommentLikeGateway.deleteCommentLike).rejects.toThrow(
        "Database error"
      );
    });
  });
});
