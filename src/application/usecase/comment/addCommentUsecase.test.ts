import { CommentEntity } from "../../../domain/comment/commentEntity.js";
import { CommentRepositoryInterface } from "../../../domain/comment/commentRepositoryInterface.js";
import { PostEntity } from "../../../domain/post/postEntity.js";
import { PostRepositoryInterface } from "../../../domain/post/postRepositoryInterface.js";
import { ValidationError } from "../../../validator/validationError.js";
import { AddCommentUsecase } from "./addCommentUsecase.js";

describe("addCommentUsecsse Test", () => {
  let mockCommentRepository: Partial<CommentRepositoryInterface>;
  let mockPostRepository: Partial<PostRepositoryInterface>;
  let addCommentUsecase: AddCommentUsecase;

  //入力データ
  const commentData = {
    userId: 1,
    postId: 2,
  };

  //正常系
  const postResult = new PostEntity(1, "テスト", 3);

  //投稿が見つからない
  const postNotFoundResult = undefined;
  //commentをすでにしている
  const commentDuplicationResult = new CommentEntity(1, 1, 2);

  beforeEach(() => {
    mockCommentRepository = {
      addComment: jest.fn(),
      getComment: jest.fn(),
    };
    mockPostRepository = {
      getPostByOnlyPostId: jest.fn(),
    };

    addCommentUsecase = new AddCommentUsecase(
      mockCommentRepository as CommentRepositoryInterface,
      mockPostRepository as PostRepositoryInterface
    );
  });

  describe("正常系", () => {
    it("コメントができる", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        undefined
      );
      const commentResult = await addCommentUsecase.run(
        commentData.userId,
        commentData.postId
      );
      expect(commentResult).toEqual(commentResult);
      expect(mockCommentRepository.getComment).toHaveBeenCalledWith(
        commentData.userId,
        commentData.postId
      );
      expect(mockPostRepository.getPostByOnlyPostId).toHaveBeenCalledWith(
        commentData.postId
      );
    });
  });
  describe("異常系", () => {
    it("コメントしたい投稿が見つからない時、バリデーションエラーを返す", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postNotFoundResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        undefined
      );
      await expect(
        addCommentUsecase.run(commentData.userId, commentData.postId)
      ).rejects.toThrow(new ValidationError("Not found post"));
    });
    it("DBエラーでコメントが失敗する", async () => {
      (mockPostRepository.getPostByOnlyPostId as jest.Mock).mockReturnValue(
        postResult
      );
      (mockCommentRepository.getComment as jest.Mock).mockReturnValue(
        undefined
      );
      const commentResult = await addCommentUsecase.run(
        commentData.userId,
        commentData.postId
      );
      (mockCommentRepository.addComment as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        addCommentUsecase.run(commentData.userId, commentData.postId)
      ).rejects.toThrow("Database error");
    });
  });
});
