import { Comment } from "@prisma/client";
import { CommentGateway } from "./commentGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("commentGateway", () => {
  let commentGateway: CommentGateway;

  //入力値
  const commentInputData = {
    id: 1,
    userId: 1,
    postId: 1,
  };

  //出力値
  const commentOutputData: Comment = {
    ...commentInputData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const notFoundComment = undefined;

  describe("addComment", () => {
    beforeEach(() => {
      commentGateway = new CommentGateway(prismaMock);
    });
    it("いいねが成功する", async () => {
      prismaMock.comment.create.mockResolvedValueOnce(commentOutputData);
      const comment = await commentGateway.addComment(
        commentInputData.userId,
        commentInputData.postId
      );
      expect(comment).toEqual(commentOutputData);
      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          userId: commentInputData.userId,
          postId: commentInputData.postId,
        },
      });
    });
    it("いいねが失敗する", async () => {
      prismaMock.comment.create.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentGateway.addComment(
          commentInputData.userId,
          commentInputData.postId
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("getComment", () => {
    beforeEach(() => {
      commentGateway = new CommentGateway(prismaMock);
    });
    it("いいねの取得が成功する", async () => {
      prismaMock.comment.findFirst.mockResolvedValueOnce(commentOutputData);
      const comment = await commentGateway.getComment(
        commentInputData.userId,
        commentInputData.postId
      );
      expect(comment).toEqual(commentOutputData);
      expect(prismaMock.comment.findFirst).toHaveBeenCalledWith({
        where: {
          userId: commentInputData.userId,
          postId: commentInputData.postId,
        },
      });
    });
    it("いいねが存在しない", async () => {
      prismaMock.comment.findFirst.mockResolvedValueOnce(null);
      const comment = await commentGateway.getComment(
        commentInputData.userId,
        commentInputData.postId
      );
      expect(comment).toEqual(notFoundComment);
      expect(prismaMock.comment.findFirst).toHaveBeenCalledWith({
        where: {
          userId: commentInputData.userId,
          postId: commentInputData.postId,
        },
      });
    });
    it("いいねの取得が失敗する", async () => {
      prismaMock.comment.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentGateway.getComment(
          commentInputData.userId,
          commentInputData.postId
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("deleteComment", () => {
    beforeEach(() => {
      commentGateway = new CommentGateway(prismaMock);
    });
    it("いいねの削除が成功する", async () => {
      prismaMock.comment.delete.mockResolvedValueOnce(commentOutputData);
      const comment = await commentGateway.deleteComment(commentInputData.id);
      expect(comment).toBe(undefined);
      expect(prismaMock.comment.delete).toHaveBeenCalledWith({
        where: {
          id: commentInputData.id,
        },
      });
    });
    it("いいねの削除失敗する", async () => {
      prismaMock.comment.delete.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentGateway.deleteComment(commentInputData.id)
      ).rejects.toThrow("Database error");
    });
  });
});
