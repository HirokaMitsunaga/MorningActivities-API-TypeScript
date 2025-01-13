import { Comment } from "@prisma/client";
import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { commentGatewayInterFace } from "./commentGateway.js";
import { CommentRepository } from "./commentRepository.js";

describe("commentRepository Test", () => {
  let mockCommentGateway: Partial<commentGatewayInterFace>;
  let commentRepository: CommentRepository;

  describe("commentRepository addComment", () => {
    //入力値
    const commentRepositoryInputData = {
      userId: 1,
      postId: 2,
    };
    //出力値
    const commentRepositoryOutputData = new CommentEntity(1, 1, 2);
    //モックの期待値
    const commentGatewayResult: Comment = {
      id: 1,
      userId: 1,
      postId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    beforeEach(() => {
      mockCommentGateway = {
        addComment: jest.fn(),
      };
      commentRepository = new CommentRepository(
        mockCommentGateway as commentGatewayInterFace
      );
    });
    it("いいねができる", async () => {
      (mockCommentGateway.addComment as jest.Mock).mockReturnValue(
        commentGatewayResult
      );
      const comment = await commentRepository.addComment(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
      expect(comment).toEqual(commentRepositoryOutputData);
      expect(mockCommentGateway.addComment).toHaveBeenCalledWith(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
    });
    it("DB接続エラーで失敗する", async () => {
      (mockCommentGateway.addComment as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(mockCommentGateway.addComment).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("commentRepository getComment", () => {
    //入力値
    const commentRepositoryInputData = {
      userId: 1,
      postId: 2,
    };
    //出力値
    const commentRepositoryOutputData = new CommentEntity(1, 1, 2);
    //モックの期待値
    const commentGatewayResult: Comment = {
      id: 1,
      userId: 1,
      postId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    beforeEach(() => {
      mockCommentGateway = {
        getComment: jest.fn(),
      };
      commentRepository = new CommentRepository(
        mockCommentGateway as commentGatewayInterFace
      );
    });
    it("いいねを取得できる", async () => {
      (mockCommentGateway.getComment as jest.Mock).mockReturnValue(
        commentGatewayResult
      );
      const comment = await commentRepository.getComment(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
      expect(comment).toEqual(commentRepositoryOutputData);
      expect(mockCommentGateway.getComment).toHaveBeenCalledWith(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
    });
    it("いいねが存在しない", async () => {
      (mockCommentGateway.getComment as jest.Mock).mockReturnValue(undefined);
      const comment = await commentRepository.getComment(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
      expect(comment).toBe(undefined);
      expect(mockCommentGateway.getComment).toHaveBeenCalledWith(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId
      );
    });
  });
});
