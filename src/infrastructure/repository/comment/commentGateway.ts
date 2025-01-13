import { Comment, PrismaClient } from "@prisma/client";

export interface commentGatewayInterFace {
  addComment(userId: number, postId: number): Promise<Comment>;
  getComment(userId: number, commentId: number): Promise<Comment | undefined>;
  deleteComment(commentId: number): Promise<void>;
}

export class CommentGateway implements commentGatewayInterFace {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async addComment(userId: number, postId: number): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      return comment;
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
      const comment = await this.prisma.comment.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });
      if (!comment) {
        return undefined;
      }
      return comment;
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
