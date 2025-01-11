import { PostEntity } from "../../../domain/post/postEntity.js";
import { DeletePostUsecase } from "./deletePostUsecase.js";

describe("DeletePostUsecase Test", () => {
  let mockPostRepository: {
    createPost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    getAllPosts: jest.Mock<Promise<PostEntity[] | undefined>, [number]>;
    getPostById: jest.Mock<Promise<PostEntity | undefined>, [number]>;
    updatePost: jest.Mock<Promise<PostEntity>, [PostEntity]>;
    deletePost: jest.Mock<Promise<void>, [number, number]>;
    getPostByOnlyPostId: jest.Mock<Promise<PostEntity | undefined>, [number]>;
  };

  let deletePostUsecase: DeletePostUsecase;

  const mockPost = new PostEntity(1, "test", 1);

  beforeEach(() => {
    mockPostRepository = {
      createPost: jest.fn(),
      getAllPosts: jest.fn(),
      getPostById: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      getPostByOnlyPostId: jest.fn(),
    };
    deletePostUsecase = new DeletePostUsecase(mockPostRepository);
  });

  const postData = {
    userId: 1,
    postId: 1,
  };

  it("タスク削除が成功する", async () => {
    mockPostRepository.getPostById.mockResolvedValue(mockPost);
    mockPostRepository.deletePost.mockResolvedValue(undefined);

    await deletePostUsecase.run(postData.userId, postData.postId);
    expect(mockPostRepository.deletePost).toHaveBeenCalledWith(
      postData.userId,
      postData.postId
    );
  });

  it("タスク削除が失敗する", async () => {
    mockPostRepository.getPostById.mockResolvedValue(mockPost);
    mockPostRepository.deletePost.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createPostUsecase.run(post);
    await expect(
      deletePostUsecase.run(postData.userId, postData.postId)
    ).rejects.toThrow("Database error");
  });
});
