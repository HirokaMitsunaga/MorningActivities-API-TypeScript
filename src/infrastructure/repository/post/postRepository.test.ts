import { PostRepository } from "./postRepository.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { Post } from "@prisma/client";

describe("PostRepository Test", () => {
  //モックの型定義
  let mockPostGateway: {
    createPost: jest.Mock<Promise<Post>, [sentence: string, userId: number]>;
    getAllPosts: jest.Mock<Promise<Post[] | undefined>, [userId: number]>;
    getPostById: jest.Mock<
      Promise<Post | undefined>,
      [userId: number, postId: number]
    >;
    updatePost: jest.Mock<
      Promise<Post>,
      [postId: number, sentence: string, userId: number]
    >;
    deletePost: jest.Mock<Promise<void>, [userId: number, postId: number]>;
  };
  let postRepository: PostRepository;

  const post = new PostEntity(undefined, "test", 1);
  const updatePost = new PostEntity(1, "test", 1);

  const expectedDomainPost = new PostEntity(1, "test", 1);

  const expectedPrismaPost = {
    id: 1,
    sentence: "test",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    //createPostのモック化
    mockPostGateway = {
      createPost: jest.fn(),
      getAllPosts: jest.fn(),
      getPostById: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
    };
    postRepository = new PostRepository(mockPostGateway);
  });
  describe("PostRepository createPost", () => {
    it("投稿作成が成功する", async () => {
      mockPostGateway.createPost.mockResolvedValue(expectedPrismaPost);
      const result = await postRepository.createPost(post);
      expect(mockPostGateway.createPost).toHaveBeenCalledWith(
        post.sentence,
        post.userId
      );
      expect(result).toEqual(expectedDomainPost);
    });
    it("投稿作成が失敗", async () => {
      mockPostGateway.createPost.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(postRepository.createPost(post)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("PostRepository getAllPosts", () => {
    it("投稿の取得に成功する", async () => {
      const expectedDomainPosts = [
        new PostEntity(
          expectedDomainPost.id,
          expectedDomainPost.sentence,
          expectedDomainPost.userId
        ),
      ];
      const expectedPrismaPosts = [expectedPrismaPost];
      mockPostGateway.getAllPosts.mockResolvedValue(expectedPrismaPosts);
      const result = await postRepository.getAllPosts(post.userId);
      expect(mockPostGateway.getAllPosts).toHaveBeenCalledWith(post.userId);
      expect(result).toEqual(expectedDomainPosts);
    });
    it("投稿が存在しない", async () => {
      mockPostGateway.getAllPosts.mockResolvedValue(undefined);
      const result = await postRepository.getAllPosts(post.userId);
      expect(result).toEqual(undefined);
    });
    it("投稿作成が失敗", async () => {
      mockPostGateway.getAllPosts.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(postRepository.getAllPosts(post.userId)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("PostRepository getPostById", () => {
    const postData = {
      userId: 1,
      postId: 1,
    };
    it("投稿の取得に成功する", async () => {
      mockPostGateway.getPostById.mockResolvedValue(expectedPrismaPost);
      const result = await postRepository.getPostById(
        postData.userId,
        postData.postId
      );
      expect(mockPostGateway.getPostById).toHaveBeenCalledWith(
        postData.userId,
        postData.postId
      );
      expect(result).toEqual(expectedDomainPost);
    });
    it("投稿が存在しない", async () => {
      mockPostGateway.getPostById.mockResolvedValue(undefined);
      const result = await postRepository.getPostById(
        postData.userId,
        postData.postId
      );
      expect(result).toEqual(undefined);
    });
    it("投稿作成が失敗", async () => {
      mockPostGateway.getPostById.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        postRepository.getPostById(postData.userId, postData.postId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("PostRepository updatePost", () => {
    it("投稿更新が成功する", async () => {
      mockPostGateway.updatePost.mockResolvedValue(expectedPrismaPost);
      const result = await postRepository.updatePost(updatePost);
      expect(mockPostGateway.updatePost).toHaveBeenCalledWith(
        updatePost.id,
        updatePost.sentence,
        updatePost.userId
      );
      expect(result).toEqual(expectedDomainPost);
    });
    it("postIdがundefined型の場合、エラーを返す", async () => {
      const undefinedPostId = new PostEntity(undefined, "test", 1);
      await expect(postRepository.updatePost(undefinedPostId)).rejects.toThrow(
        "postId is required and must be a number"
      );
    });
    it("投稿作成が失敗", async () => {
      mockPostGateway.updatePost.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(postRepository.updatePost(updatePost)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("PostRepository deletePost", () => {
    const postData = {
      userId: 1,
      postId: 1,
    };
    it("投稿の削除に成功する", async () => {
      mockPostGateway.deletePost.mockResolvedValue(undefined);
      const result = await postRepository.deletePost(
        postData.userId,
        postData.postId
      );
      expect(mockPostGateway.deletePost).toHaveBeenCalledWith(
        postData.userId,
        postData.postId
      );
      expect(result).toBe(undefined);
    });

    it("投稿作成が失敗", async () => {
      mockPostGateway.deletePost.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        postRepository.deletePost(postData.userId, postData.postId)
      ).rejects.toThrow("Database error");
    });
  });
});
