import { PostEntity } from "../../../domain/post/postEntity.js";
import { GetAllPostsUsecase } from "./getAllPostsUsecase.js";

describe("GetAllPostsUsecase Test", () => {
  let mockPostRepository: {
    createPost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    getAllPosts: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
    getPostById: jest.Mock<Promise<PostEntity | undefined>, [number]>;
    updatePost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    deletePost: jest.Mock<Promise<void>, [number, number]>;
    getPostByOnlyPostId: jest.Mock<Promise<PostEntity | undefined>, [number]>;
  };

  let getAllPostsUsecase: GetAllPostsUsecase;

  const post = new PostEntity(undefined, "test", 1);

  const expectedPost = new PostEntity(1, "test", 1);

  beforeEach(() => {
    mockPostRepository = {
      createPost: jest.fn(),
      getAllPosts: jest.fn(),
      getPostById: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      getPostByOnlyPostId: jest.fn(),
    };
    getAllPostsUsecase = new GetAllPostsUsecase(mockPostRepository);
  });

  const expectedPosts = [
    new PostEntity(expectedPost.id, expectedPost.sentence, expectedPost.userId),
  ];

  it("タスク取得が成功する", async () => {
    mockPostRepository.getAllPosts.mockResolvedValue(expectedPosts);
    const result = await getAllPostsUsecase.run(post.userId);
    expect(result).toBe(expectedPosts);
    expect(mockPostRepository.getAllPosts).toHaveBeenCalledWith(post.userId);
  });
  it("タスクが存在しない", async () => {
    mockPostRepository.getAllPosts.mockResolvedValue(undefined);
    const result = await getAllPostsUsecase.run(post.userId);
    expect(result).toBe(undefined);
  });
  it("タスク取得が失敗する", async () => {
    mockPostRepository.getAllPosts.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createPostUsecase.run(post);
    await expect(getAllPostsUsecase.run(post.userId)).rejects.toThrow(
      "Database error"
    );
  });
});
