import { PostGateway } from "./postGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("PostGateway", () => {
  let postGateway: PostGateway;

  const postData = {
    sentence: "test",
    userId: 2,
  };

  const updataPostData = {
    id: 1,
    sentence: "test",
    userId: 2,
  };

  beforeAll(() => {
    postGateway = new PostGateway(prismaMock);
  });
  describe("PostGateway createPost", () => {
    it("投稿の作成に成功する", async () => {
      const expectedPost = {
        id: 1,
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.post.create.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.createPost(
        postData.sentence,
        postData.userId
      );
      expect(postRecord).toEqual(expectedPost);
      expect(prismaMock.post.create).toHaveBeenCalledWith({ data: postData });
    });

    it("投稿作成時にDBエラーで失敗する", async () => {
      prismaMock.post.create.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        postGateway.createPost(postData.sentence, postData.userId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("PostGateway getAllPosts", () => {
    it("投稿の取得に成功する", async () => {
      const expectedPost = [
        {
          id: 1,
          ...postData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.post.findMany.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.getAllPosts(postData.userId);
      expect(postRecord).toEqual(expectedPost);
    });
    it("投稿が存在しない", async () => {
      prismaMock.post.findMany.mockResolvedValue([]);
      expect(await postGateway.getAllPosts(postData.userId)).toEqual([]);
    });

    it("投稿作成時にDBエラーで失敗する", async () => {
      prismaMock.post.findMany.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(postGateway.getAllPosts(postData.userId)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("PostGateway getPostById", () => {
    const postData = {
      postId: 1,
      userId: 2,
    };
    it("投稿の取得に成功する", async () => {
      const expectedPost = {
        id: 1,
        sentence: "test",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.post.findFirst.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.getPostById(
        postData.userId,
        postData.postId
      );
      expect(postRecord).toEqual(expectedPost);
    });
    it("投稿が存在しない", async () => {
      prismaMock.post.findFirst.mockResolvedValue(null);
      expect(
        await postGateway.getPostById(postData.userId, postData.postId)
      ).toEqual(undefined);
    });

    it("投稿作成時にDBエラーで失敗する", async () => {
      prismaMock.post.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        postGateway.getPostById(postData.userId, postData.postId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("PostGateway updatePost", () => {
    it("投稿の更新に成功する", async () => {
      const expectedPost = {
        id: 1,
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.post.update.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.updatePost(
        updataPostData.id,
        updataPostData.sentence,
        updataPostData.userId
      );
      expect(postRecord).toEqual(expectedPost);
      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: {
          id: updataPostData.id,
          userId: updataPostData.userId,
        },
        data: {
          sentence: updataPostData.sentence,
        },
      });
    });

    it("投稿作成時にDBエラーで失敗する", async () => {
      prismaMock.post.update.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        postGateway.updatePost(
          updataPostData.id,
          updataPostData.sentence,
          updataPostData.userId
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("PostGateway deletePost", () => {
    const postData = {
      postId: 1,
      userId: 2,
    };
    it("投稿の削除に成功する", async () => {
      const expectedPost = {
        id: 1,
        sentence: "test",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.post.delete.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.deletePost(
        postData.userId,
        postData.postId
      );
      expect(postRecord).toBe(undefined);
    });

    it("投稿削除時にDBエラーで失敗する", async () => {
      prismaMock.post.delete.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        postGateway.deletePost(postData.userId, postData.postId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("PostGateway getPostByOnlyPostId", () => {
    const postData = {
      postId: 1,
    };
    it("投稿の取得に成功する", async () => {
      const expectedPost = {
        id: 1,
        sentence: "test",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.post.findFirst.mockResolvedValue(expectedPost);
      const postRecord = await postGateway.getPostByOnlyPostId(postData.postId);
      expect(postRecord).toEqual(expectedPost);
    });
    it("投稿が存在しない", async () => {
      prismaMock.post.findFirst.mockResolvedValue(null);
      expect(await postGateway.getPostByOnlyPostId(postData.postId)).toEqual(
        undefined
      );
    });

    it("投稿作成時にDBエラーで失敗する", async () => {
      prismaMock.post.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        postGateway.getPostByOnlyPostId(postData.postId)
      ).rejects.toThrow("Database error");
    });
  });
});
