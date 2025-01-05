import { PostEntity } from "../../../domain/post/postEntity.js";
import { GetPostByIdUsecase } from "./getPostByIdUsecase.js";

describe("GetPostByIdUsecase Test", () => {
  let mockPostRepository: {
    createPost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    getAllPosts: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
    getPostById: jest.Mock<Promise<PostEntity | undefined>, [number]>;
    updatePost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    deletePost: jest.Mock<Promise<void>, [number, number]>;
  };

  let getPostByIdUsecase: GetPostByIdUsecase;

  const post = new PostEntity(undefined, "test", 1);

  const expectedPost = new PostEntity(1, "test", 1);

  beforeEach(() => {
    mockPostRepository = {
      createPost: jest.fn(),
      getAllPosts: jest.fn(),
      getPostById: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
    };
    getPostByIdUsecase = new GetPostByIdUsecase(mockPostRepository);
  });

  const postData = {
    userId: 1,
    postId: 1,
  };

  it("タスク取得が成功する", async () => {
    mockPostRepository.getPostById.mockResolvedValue(expectedPost);
    const result = await getPostByIdUsecase.run(
      postData.userId,
      postData.postId
    );
    expect(result).toBe(expectedPost);
    expect(mockPostRepository.getPostById).toHaveBeenCalledWith(
      postData.userId,
      postData.postId
    );
  });
  it("タスクが存在しない", async () => {
    mockPostRepository.getAllPosts.mockResolvedValue(undefined);
    const result = await getPostByIdUsecase.run(
      postData.userId,
      postData.postId
    );
    expect(result).toBe(undefined);
  });
  it("タスク取得が失敗する", async () => {
    mockPostRepository.getPostById.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createPostUsecase.run(post);
    await expect(
      getPostByIdUsecase.run(postData.userId, postData.postId)
    ).rejects.toThrow("Database error");
  });
});
