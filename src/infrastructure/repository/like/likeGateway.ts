import { Like, PrismaClient } from "@prisma/client";

export interface likeGatewayInterFace {
  addLike(userId: number, postId: number): Promise<Like>;
  getLike(userId: number, likeId: number): Promise<Like | undefined>;
  deleteLike(likeId: number): Promise<void>;
}

export class likeGateway implements likeGatewayInterFace {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async addLike(userId: number, postId: number): Promise<Like> {
    try {
      const like = await this.prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      return like;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating like");
    }
  }
  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    try {
      const like = await this.prisma.like.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });
      if (!like) {
        return undefined;
      }
      return like;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unkown error occurred while get like ");
    }
  }
  async deleteLike(likeId: number): Promise<void> {
    try {
      await this.prisma.like.delete({
        where: {
          id: likeId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete like");
    }
  }
}
