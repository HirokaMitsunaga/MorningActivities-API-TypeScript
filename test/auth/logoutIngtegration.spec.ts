import { middlewareFactory } from "../../src/middleware/appMiddleware.js";
import user from "../../src/presentation/auth/userRouter.js";

import { Hono } from "hono";

const correctUserData = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

describe("Login integration test", () => {
  let app: Hono;
  beforeEach(() => {
    app = middlewareFactory.createApp().basePath("/api");
    app.route("/", user);
  });

  it("Cookieの削除に成功しログアウトが成功する", async () => {
    //ログイン
    const loginResponse = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: correctUserData.email,
        name: correctUserData.name,
        password: correctUserData.password,
      }),
    });
    expect(loginResponse.status).toBe(201);
    //ログアウト
    const logoutResponse = await app.request("/api/logout", {
      method: "POST",
      headers: {
        Cookie: loginResponse.headers.get("Set-Cookie") || "",
      },
    });
    const responseBody = await logoutResponse.json();
    console.log("Logout response body:", responseBody); // レスポンスの内容を確認
    expect(logoutResponse.status).toBe(201);
  });
  it("Cookieの削除に失敗し、ログアウトが失敗する", async () => {
    const response = await app.request("/api/logout", {
      method: "POST",
    });
    expect(response.status).toBe(500);
  });
});
