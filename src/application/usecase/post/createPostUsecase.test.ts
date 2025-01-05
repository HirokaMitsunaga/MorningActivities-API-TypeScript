import { PostEntity } from "../../../domain/post/postEntity.js";
import { CreatePostUsecase } from "./createPostUsecase.js";

describe("CreatePostUsecase Test", () => {
  let mockPostRepository: {
    createPost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    getAllPosts: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
    getPostById: jest.Mock<Promise<PostEntity | undefined>, [number]>;
    updatePost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    deletePost: jest.Mock<Promise<void>, [number, number]>;
  };

  let createPostUsecase: CreatePostUsecase;

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
    createPostUsecase = new CreatePostUsecase(mockPostRepository);
  });

  it("投稿作成が成功する", async () => {
    mockPostRepository.createPost.mockResolvedValue(expectedPost);
    const result = await createPostUsecase.run(post);
    expect(result).toBe(expectedPost);
    expect(mockPostRepository.createPost).toHaveBeenCalledWith(post);
  });
  it("投稿作成が失敗する", async () => {
    mockPostRepository.createPost.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createPostUsecase.run(post);
    await expect(createPostUsecase.run(post)).rejects.toThrow("Database error");
  });
});
