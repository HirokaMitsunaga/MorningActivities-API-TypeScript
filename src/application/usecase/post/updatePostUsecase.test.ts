import { PostEntity } from "../../../domain/post/postEntity.js";
import { UpdatePostUsecase } from "./updatePostUsecase.js";

describe("UpdatePostUsecase Test", () => {
  let mockPostRepository: {
    createPost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    getAllPosts: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
    getPostById: jest.Mock<Promise<PostEntity | undefined>, [number]>;
    updatePost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    deletePost: jest.Mock<Promise<void>, [number, number]>;
  };

  let updatePostUsecase: UpdatePostUsecase;

  const post = new PostEntity(1, "test", 1);

  const expectedPost = new PostEntity(1, "test", 1);

  const undefinedPostId = new PostEntity(undefined, "test", 1);

  beforeEach(() => {
    mockPostRepository = {
      createPost: jest.fn(),
      getAllPosts: jest.fn(),
      getPostById: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
    };
    updatePostUsecase = new UpdatePostUsecase(mockPostRepository);
  });

  it("タスク更新が成功する", async () => {
    mockPostRepository.updatePost.mockResolvedValue(expectedPost);
    const result = await updatePostUsecase.run(post);
    expect(result).toBe(expectedPost);
    expect(mockPostRepository.updatePost).toHaveBeenCalledWith(post);
  });
  it("postIdがundefined型の場合、エラーを返す", async () => {
    mockPostRepository.updatePost.mockRejectedValueOnce(
      new Error("Database error")
    );
    await expect(updatePostUsecase.run(undefinedPostId)).rejects.toThrow(
      "postId is required and must be a number"
    );
  });
  it("タスク更新が失敗する", async () => {
    mockPostRepository.updatePost.mockRejectedValueOnce(
      new Error("Database error")
    );
    await expect(updatePostUsecase.run(post)).rejects.toThrow("Database error");
  });
});