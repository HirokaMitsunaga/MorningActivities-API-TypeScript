import { Hono } from "hono";
import { SignupUserUsecase } from "../application/usecase/signupUserUsecase.js";
import { UserPostRequestBody } from "./userRouter.js";
import { User } from "@prisma/client";
import { UserGateway } from "../infrastructure/userGateway.js";
import { PrismaClient } from "@prisma/client/extension";

describe("signup test", () => {
  //userGatewayがSignupUserUsecaseへ依存しており、userGatewayに対してもモック化する必要があるため下記のようにしてSignupUserUsecaseをモック化する
  let mockSignupUserUsecase: {
    run: jest.Mock<Promise<User>, [UserPostRequestBody]>;
  };

  const userData: UserPostRequestBody = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  const expectedUser = {
    id: 1,
    ...userData,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const app = new Hono();
  app.post("/signup", async (c) => {
    try {
      const data = await c.req.json<UserPostRequestBody>();
      const user = await mockSignupUserUsecase.run(data);
      return c.json(user, 201);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to sign up" },
        500
      );
    }
  });

  describe("signup", () => {
    beforeEach(() => {
      mockSignupUserUsecase = {
        run: jest.fn(),
      };
      mockSignupUserUsecase.run.mockResolvedValue(expectedUser);
    });

    it("ステータスコード201を返すこと", async () => {
      const res = await app.request("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      expect(res.status).toBe(201);
    });

    it("ステータスコードが500を返すこと", async () => {
      // モックがエラーをスローするように設定
      mockSignupUserUsecase.run.mockRejectedValue(
        new Error("Internal Server Error")
      );

      const res = await app.request("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Internal Server Error" });
    });

    it("作成されたユーザー情報を返すこと", async () => {
      const res = await app.request("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const body = await res.json();
      expect(body).toEqual({
        ...expectedUser,
        //resでstringifyを使っているためDate型が文字列変換される。その対策としてexpectedUserもDate型からstring型に変換する
        created_at: expectedUser.created_at.toISOString(),
        updated_at: expectedUser.updated_at.toISOString(),
      });
    });

    it("ユースケースが正しいデータで呼び出されること", async () => {
      await app.request("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      expect(mockSignupUserUsecase.run).toHaveBeenCalledWith(userData);
    });
  });
});
