import { Comment } from "@prisma/client";
import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { commentGatewayInterFace } from "./commentGateway.js";
import { CommentRepository } from "./commentRepository.js";

describe("commentRepository Test", () => {
  let mockCommentGateway: Partial<commentGatewayInterFace>;
  let commentRepository: CommentRepository;
  //入力値
  const commentRepositoryInputData = {
    userId: 1,
    postId: 2,
    comment: "test",
    commentId: 1,
  };
  //出力値
  const commentRepositoryOutputData = new CommentEntity(1, "test", 1, 2);
  //モックの期待値
  const commentGatewayResult: Comment = {
    id: 1,
    userId: 1,
    comment: "test",
    postId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("commentRepository addComment", () => {
    beforeEach(() => {
      mockCommentGateway = {
        addComment: jest.fn(),
      };
      commentRepository = new CommentRepository(
        mockCommentGateway as commentGatewayInterFace
      );
    });
    it("コメントができる", async () => {
      (mockCommentGateway.addComment as jest.Mock).mockReturnValue(
        commentGatewayResult
      );
      const comment = await commentRepository.addComment(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId,
        commentRepositoryInputData.comment
      );
      expect(comment).toEqual(commentRepositoryOutputData);
      expect(mockCommentGateway.addComment).toHaveBeenCalledWith(
        commentRepositoryInputData.userId,
        commentRepositoryInputData.postId,
        commentRepositoryInputData.comment
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

    beforeEach(() => {
      mockCommentGateway = {
        getComment: jest.fn(),
      };
      commentRepository = new CommentRepository(
        mockCommentGateway as commentGatewayInterFace
      );
    });
    it("コメントを取得できる", async () => {
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
    it("コメントが存在しない", async () => {
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
  describe("commentRepository deleteComment", () => {
    beforeEach(() => {
      mockCommentGateway = {
        deleteComment: jest.fn(),
      };
      commentRepository = new CommentRepository(
        mockCommentGateway as commentGatewayInterFace
      );
    });
    it("いいねの削除ができる", async () => {
      (mockCommentGateway.deleteComment as jest.Mock).mockReturnValue(
        commentGatewayResult
      );
      const comment = await commentRepository.deleteComment(
        commentRepositoryInputData.commentId
      );
      expect(comment).toEqual(undefined);
      expect(mockCommentGateway.deleteComment).toHaveBeenCalledWith(
        commentRepositoryInputData.commentId
      );
    });
    it("DB接続エラーで失敗する", async () => {
      (mockCommentGateway.deleteComment as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(mockCommentGateway.deleteComment).rejects.toThrow(
        "Database error"
      );
    });
  });
});
