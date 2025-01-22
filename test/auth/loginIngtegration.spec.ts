import { middlewareFactory } from "../../src/middleware/appMiddleware.js";
import user from "../../src/presentation/auth/userRouter.js";

import { Hono } from "hono";

const correctUserData = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

const noUserData = {
  email: "mmmm@example.com",
  name: "Test  No User",
  password: "password123",
};

const incorrectPasswordUserData = {
  email: "aaa@example.com",
  name: "Test User",
  password: "incorrect",
};

describe("Login integration test", () => {
  let app: Hono;
  beforeEach(() => {
    app = middlewareFactory.createApp().basePath("/api");
    app.route("/", user);
  });

  it("正しいパスワードでログインが成功する", async () => {
    const response = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: correctUserData.email,
        name: correctUserData.name,
        password: correctUserData.password,
      }),
    });
    expect(response.status).toBe(201);
  });
  it("ユーザが存在せずログインが失敗", async () => {
    const response = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: noUserData.email,
        name: noUserData.name,
        password: noUserData.password,
      }),
    });
    expect(response.status).toBe(400);
  });
  it("パスワードが違いログインが失敗", async () => {
    const response = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: incorrectPasswordUserData.email,
        name: incorrectPasswordUserData.name,
        password: incorrectPasswordUserData.password,
      }),
    });
    expect(response.status).toBe(400);
  });
});
