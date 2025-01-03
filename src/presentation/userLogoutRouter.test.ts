import { Hono } from "hono";
import { UserPostRequestBody } from "./userRouter.js";
import { testClient } from "hono/testing";
import { deleteCookie } from "hono/cookie";

// モジュールのモック化
jest.mock("hono/cookie");
// モック化された関数の取得
const mockDeleteCookie = jest.mocked(deleteCookie);

describe("logout test", () => {
  const userData: UserPostRequestBody = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  const app = new Hono().post("/api/logout", async (c) => {
    try {
      //TODO: 後で.envからcookieSecretを設定するようにする
      const isDeleteCookie = mockDeleteCookie(c, "token", {
        path: "/",
        secure: true,
        domain: "localhost",
      });
      if (!isDeleteCookie) {
        throw new Error("Failed to delete cookie");
      }
      return c.json({ message: "Logout successful" }, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json(error.message, 500);
      }
      return c.json({ message: "Failed to logout" }, 500);
    }
  });

  describe("logout", () => {
    it("Cookieの削除に成功", async () => {
      const client = testClient(app);
      mockDeleteCookie.mockReturnValue(
        "token=; path=/; secure; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      const logoutRes = await client.api.logout.$post();
      // ステータスコードの確認
      expect(logoutRes.status).toBe(201);
      // レスポンスボディの確認
      const body = await logoutRes.json();
      expect(body).toEqual({ message: "Logout successful" });
    });
    it("Cookieの削除に失敗", async () => {
      const client = testClient(app);
      mockDeleteCookie.mockReturnValue(undefined);
      const logoutRes = await client.api.logout.$post();

      expect(logoutRes.status).toBe(500);
      expect(mockDeleteCookie).toThrow;
      const body = await logoutRes.json();
      expect(body).toEqual("Failed to delete cookie");
    });
  });
});
