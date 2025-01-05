import { Hono } from "hono";
import { UserPostRequestBody } from "./userRouter.js";
import { User } from "@prisma/client";
import { testClient } from "hono/testing";
import { UserModel } from "../validator/user.js";
import { ValidationError } from "../validator/validationError.js";

describe("signup and login test", () => {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const app = new Hono().post("/api/signup", async (c) => {
    try {
      const data = await c.req.json<UserPostRequestBody>();

      const userValidation = UserModel.safeParse(data);
      if (!userValidation.success) {
        throw new ValidationError(
          userValidation.error.errors.map((err) => err.message).join(", ")
        );
      }
      const user = await mockSignupUserUsecase.run(data);
      return c.json(user, 201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to sign up" }, 500);
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
      const client = testClient(app);
      const res = await client.api.signup.$post({
        json: userData,
      });

      expect(res.status).toBe(201);
      expect(mockSignupUserUsecase.run).toHaveBeenCalledWith(userData);
    });

    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidUserData = {
        email: "invalid-email",
        name: "",
        password: "",
      };

      const client = testClient(app);
      const res = await client.api.signup.$post({
        json: invalidUserData,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Invalid email");
    });

    it("メールアドレスがユニークキー制約である時は400を返すこと", async () => {
      mockSignupUserUsecase.run.mockRejectedValueOnce(
        new ValidationError("This email address is already registered")
      );
      const client = testClient(app);
      const res = await client.api.signup.$post({
        json: userData,
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("This email address is already registered");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockSignupUserUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.signup.$post({
        json: userData,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to sign up" });
    });
  });
});
