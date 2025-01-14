import { CommentLike } from "@prisma/client";
import { CommentLikeGateway } from "./commentLikeGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("commentLikeGateway", () => {
  let commentLikeGateway: CommentLikeGateway;

  //入力値
  const commentLikeInputData = {
    id: 1,
    userId: 1,
    commentId: 1,
  };

  //出力値
  const commentLikeOutputData: CommentLike = {
    ...commentLikeInputData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const notFoundCommentLike = undefined;

  describe("addCommentLike", () => {
    beforeEach(() => {
      commentLikeGateway = new CommentLikeGateway(prismaMock);
    });
    it("いいねが成功する", async () => {
      prismaMock.commentLike.create.mockResolvedValueOnce(
        commentLikeOutputData
      );
      const commentLike = await commentLikeGateway.addCommentLike(
        commentLikeInputData.userId,
        commentLikeInputData.commentId
      );
      expect(commentLike).toEqual(commentLikeOutputData);
      expect(prismaMock.commentLike.create).toHaveBeenCalledWith({
        data: {
          userId: commentLikeInputData.userId,
          commentId: commentLikeInputData.commentId,
        },
      });
    });
    it("いいねが失敗する", async () => {
      prismaMock.commentLike.create.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentLikeGateway.addCommentLike(
          commentLikeInputData.userId,
          commentLikeInputData.commentId
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("getCommentLike", () => {
    beforeEach(() => {
      commentLikeGateway = new CommentLikeGateway(prismaMock);
    });
    it("いいねの取得が成功する", async () => {
      prismaMock.commentLike.findFirst.mockResolvedValueOnce(
        commentLikeOutputData
      );
      const commentLike = await commentLikeGateway.getCommentLike(
        commentLikeInputData.userId,
        commentLikeInputData.commentId
      );
      expect(commentLike).toEqual(commentLikeOutputData);
      expect(prismaMock.commentLike.findFirst).toHaveBeenCalledWith({
        where: {
          userId: commentLikeInputData.userId,
          commentId: commentLikeInputData.commentId,
        },
      });
    });
    it("いいねが存在しない", async () => {
      prismaMock.commentLike.findFirst.mockResolvedValueOnce(null);
      const commentLike = await commentLikeGateway.getCommentLike(
        commentLikeInputData.userId,
        commentLikeInputData.commentId
      );
      expect(commentLike).toEqual(notFoundCommentLike);
      expect(prismaMock.commentLike.findFirst).toHaveBeenCalledWith({
        where: {
          userId: commentLikeInputData.userId,
          commentId: commentLikeInputData.commentId,
        },
      });
    });
    it("いいねの取得が失敗する", async () => {
      prismaMock.commentLike.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentLikeGateway.getCommentLike(
          commentLikeInputData.userId,
          commentLikeInputData.commentId
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("deleteCommentLike", () => {
    beforeEach(() => {
      commentLikeGateway = new CommentLikeGateway(prismaMock);
    });
    it("いいねの削除が成功する", async () => {
      prismaMock.commentLike.delete.mockResolvedValueOnce(
        commentLikeOutputData
      );
      const commentLike = await commentLikeGateway.deleteCommentLike(
        commentLikeInputData.id
      );
      expect(commentLike).toBe(undefined);
      expect(prismaMock.commentLike.delete).toHaveBeenCalledWith({
        where: {
          id: commentLikeInputData.id,
        },
      });
    });
    it("いいねの削除失敗する", async () => {
      prismaMock.commentLike.delete.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        commentLikeGateway.deleteCommentLike(commentLikeInputData.id)
      ).rejects.toThrow("Database error");
    });
  });
});
