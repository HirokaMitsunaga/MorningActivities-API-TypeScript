import { Hono } from "hono";
import { UserPostRequestBody } from "./userRouter.js";
import { testClient } from "hono/testing";
import { UserModel } from "../validator/user.js";
import { ValidationError } from "../validator/validationError.js";
import { setSignedCookie } from "hono/cookie";

describe("login and login test", () => {
  //userGatewayがloginUserUsecaseへ依存しており、userGatewayに対してもモック化する必要があるため下記のようにしてloginUserUsecaseをモック化する
  let mockLoginUserUsecase: {
    run: jest.Mock<Promise<string>, [UserPostRequestBody]>;
  };

  const userData: UserPostRequestBody = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  const expectedToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ4LCJyb2xlIjoidXNlciIsImV4cCI6MTczNTc5Nzg2MH0.kRIpdR8BidSgbBBPqhrtVG-3jcbrfgXpTOtftSP8lpY";

  const app = new Hono().post("/api/login", async (c) => {
    try {
      const data = await c.req.json<UserPostRequestBody>();

      const userValidation = UserModel.safeParse(data);
      if (!userValidation.success) {
        throw new ValidationError(
          userValidation.error.errors.map((err) => err.message).join(", ")
        );
      }
      const tokenString = await mockLoginUserUsecase.run(userData);
      //TODO: 後で.envからcookieSecretを設定するようにする
      await setSignedCookie(c, "token", tokenString, "cookieSecret", {
        path: "/",
        secure: true,
        domain: "localhost",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        sameSite: "Lax",
      });
      return c.json({ message: "Login successful" }, 201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Failed to login" }, 500);
    }
  });

  describe("login", () => {
    beforeEach(() => {
      mockLoginUserUsecase = {
        run: jest.fn(),
      };
      mockLoginUserUsecase.run.mockResolvedValue(expectedToken);
    });

    it("ステータスコード201が返されること", async () => {
      const client = testClient(app);
      const res = await client.api.login.$post({
        json: userData,
      });

      expect(res.status).toBe(201);
      expect(mockLoginUserUsecase.run).toHaveBeenCalledWith(userData);
      const body = await res.json();
      expect(body).toEqual({ message: "Login successful" });
    });
    it("ログイン成功時にクッキーが設定されていること", async () => {
      const client = testClient(app);
      const res = await client.api.login.$post({
        json: userData,
      });

      const cookies = res.headers.get("set-cookie");
      expect(cookies).toContain(expectedToken);
    });
    it("バリデーションエラー時は400を返すこと", async () => {
      const invalidUserData = {
        email: "invalid-email",
        name: "",
        password: "",
      };
      const client = testClient(app);
      const res = await client.api.login.$post({
        json: invalidUserData,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Invalid email");
    });
    it("ユーザが存在しない時は、400エラーを返すこと", async () => {
      mockLoginUserUsecase.run.mockRejectedValue(
        new ValidationError("Not found user")
      );
      const client = testClient(app);
      const res = await client.api.login.$post({
        json: userData,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Not found user");
    });
    it("パスワードが間違っている時、400エラーを返すこと", async () => {
      mockLoginUserUsecase.run.mockRejectedValueOnce(
        new ValidationError("Password is incorrect")
      );
      const client = testClient(app);
      const res = await client.api.login.$post({
        json: userData,
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toContain("Password is incorrect");
    });

    it("ステータスコードが500を返すこと", async () => {
      mockLoginUserUsecase.run.mockRejectedValueOnce(
        new Error("Database connection error")
      );

      const client = testClient(app);
      const res = await client.api.login.$post({
        json: userData,
      });
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: "Failed to login" });
    });
  });
});
