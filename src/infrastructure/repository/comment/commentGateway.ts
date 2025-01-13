import { Comment, PrismaClient } from "@prisma/client";
import comment from "../../../presentation/comment/commentRouter.js";

export interface commentGatewayInterFace {
  addComment(userId: number, postId: number, comment: string): Promise<Comment>;
  getComment(userId: number, commentId: number): Promise<Comment | undefined>;
  deleteComment(commentId: number): Promise<void>;
}

export class CommentGateway implements commentGatewayInterFace {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async addComment(
    userId: number,
    postId: number,
    comment: string
  ): Promise<Comment> {
    try {
      const commentRes = await this.prisma.comment.create({
        data: {
          userId: userId,
          postId: postId,
          comment: comment,
        },
      });
      return commentRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating comment");
    }
  }
  async getComment(
    userId: number,
    postId: number
  ): Promise<Comment | undefined> {
    try {
      const commentRes = await this.prisma.comment.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });
      if (!commentRes) {
        return undefined;
      }
      return commentRes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unkown error occurred while get comment ");
    }
  }
  async deleteComment(commentId: number): Promise<void> {
    try {
      await this.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete comment");
    }
  }
}
