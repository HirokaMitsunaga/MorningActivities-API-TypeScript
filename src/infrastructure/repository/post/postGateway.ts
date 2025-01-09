import { PrismaClient, Post } from "@prisma/client";

export interface PostGatewayInterface {
  createPost(sentence: string, userId: number): Promise<Post>;
  getAllPosts(userId: number): Promise<Post[] | undefined>;
  getPostById(userId: number, postId: number): Promise<Post | undefined>;
  updatePost(postId: number, sentence: string, userId: number): Promise<Post>;
  deletePost(postId: number, userId: number): Promise<void>;
  getPostByOnlyPostId(postId: number): Promise<Post | undefined>;
}

export class PostGateway implements PostGatewayInterface {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async createPost(sentence: string, userId: number): Promise<Post> {
    try {
      const post = await this.prisma.post.create({
        data: {
          sentence: sentence,
          userId: userId,
        },
      });
      return post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while creating post");
    }
  }
  async getAllPosts(userId: number): Promise<Post[] | undefined> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          userId: userId,
        },
      });
      if (!posts) {
        return undefined;
      }
      return posts;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get all posts");
    }
  }
  async getPostById(userId: number, postId: number): Promise<Post | undefined> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
          userId: userId,
        },
      });
      if (!post) {
        return undefined;
      }
      return post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get post by id");
    }
  }
  async updatePost(
    postId: number,
    sentence: string,
    userId: number
  ): Promise<Post> {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
          userId: userId,
        },
        data: {
          sentence: sentence,
        },
      });
      return post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while update post");
    }
  }
  async deletePost(userId: number, postId: number): Promise<void> {
    try {
      await this.prisma.post.delete({
        where: {
          id: postId,
          userId: userId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while delete post");
    }
  }

  async getPostByOnlyPostId(postId: number): Promise<Post | undefined> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
        },
      });
      if (!post) {
        return undefined;
      }
      return post;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred while get post by only id");
    }
  }
}
