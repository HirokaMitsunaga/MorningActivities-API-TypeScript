import { Like } from "@prisma/client";
import { LikeGateway } from "./likeGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("likeGateway", () => {
  let likeGateway: LikeGateway;

  //入力値
  const likeInputData = {
    id: 1,
    userId: 1,
    postId: 1,
  };

  //出力値
  const likeOutputData: Like = {
    ...likeInputData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const notFoundLike = undefined;

  describe("addLike", () => {
    beforeEach(() => {
      likeGateway = new LikeGateway(prismaMock);
    });
    it("いいねが成功する", async () => {
      prismaMock.like.create.mockResolvedValueOnce(likeOutputData);
      const like = await likeGateway.addLike(
        likeInputData.userId,
        likeInputData.postId
      );
      expect(like).toEqual(likeOutputData);
      expect(prismaMock.like.create).toHaveBeenCalledWith({
        data: {
          userId: likeInputData.userId,
          postId: likeInputData.postId,
        },
      });
    });
    it("いいねが失敗する", async () => {
      prismaMock.like.create.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        likeGateway.addLike(likeInputData.userId, likeInputData.postId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("getLike", () => {
    beforeEach(() => {
      likeGateway = new LikeGateway(prismaMock);
    });
    it("いいねの取得が成功する", async () => {
      prismaMock.like.findFirst.mockResolvedValueOnce(likeOutputData);
      const like = await likeGateway.getLike(
        likeInputData.userId,
        likeInputData.postId
      );
      expect(like).toEqual(likeOutputData);
      expect(prismaMock.like.findFirst).toHaveBeenCalledWith({
        where: {
          userId: likeInputData.userId,
          postId: likeInputData.postId,
        },
      });
    });
    it("いいねが存在しない", async () => {
      prismaMock.like.findFirst.mockResolvedValueOnce(null);
      const like = await likeGateway.getLike(
        likeInputData.userId,
        likeInputData.postId
      );
      expect(like).toEqual(notFoundLike);
      expect(prismaMock.like.findFirst).toHaveBeenCalledWith({
        where: {
          userId: likeInputData.userId,
          postId: likeInputData.postId,
        },
      });
    });
    it("いいねの取得が失敗する", async () => {
      prismaMock.like.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        likeGateway.getLike(likeInputData.userId, likeInputData.postId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("deleteLike", () => {
    beforeEach(() => {
      likeGateway = new LikeGateway(prismaMock);
    });
    it("いいねの削除が成功する", async () => {
      prismaMock.like.delete.mockResolvedValueOnce(likeOutputData);
      const like = await likeGateway.deleteLike(likeInputData.id);
      expect(like).toBe(undefined);
      expect(prismaMock.like.delete).toHaveBeenCalledWith({
        where: {
          id: likeInputData.id,
        },
      });
    });
    it("いいねの削除失敗する", async () => {
      prismaMock.like.delete.mockRejectedValueOnce(new Error("Database error"));
      await expect(likeGateway.deleteLike(likeInputData.id)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
