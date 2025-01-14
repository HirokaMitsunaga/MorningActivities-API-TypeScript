import { CommentLike, PrismaClient } from "@prisma/client";

export interface commentLikeGatewayInterFace {
  addCommentLike(userId: number, commentId: number): Promise<CommentLike>;
  getCommentLike(
    userId: number,
    commentLikeCommentId: number
  ): Promise<CommentLike | undefined>;
  deleteCommentLike(commentLikeCommentId: number): Promise<void>;
}

export class CommentLikeGateway implements commentLikeGatewayInterFace {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async addCommentLike(
    userId: number,
    commentId: number
  ): Promise<CommentLike> {
    try {
      const commentLikeComment = await this.prisma.commentLike.create({
        data: {
          userId: userId,
          commentId: commentId,
        },
      });
      return commentLikeComment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Unknown error occurred while creating commentLikeComment"
      );
    }
  }
  async getCommentLike(
    userId: number,
    commentId: number
  ): Promise<CommentLike | undefined> {
    try {
      const commentLikeComment = await this.prisma.commentLike.findFirst({
        where: {
          commentId: commentId,
          userId: userId,
        },
      });
      if (!commentLikeComment) {
        return undefined;
      }
      return commentLikeComment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unkown error occurred while get commentLikeComment ");
    }
  }
  async deleteCommentLike(commentLikeCommentId: number): Promise<void> {
    try {
      await this.prisma.commentLike.delete({
        where: {
          id: commentLikeCommentId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete commentLikeComment");
    }
  }
}
