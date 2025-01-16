import { middlewareFactory } from "../../src/middleware/appMiddleware.js";
import user from "../../src/presentation/auth/userRouter.js";

import { Hono } from "hono";

const correctUserData = {
  email: `test1+${Date.now()}@example.com`,
  name: "Test User",
  password: "password123",
};

const inValidUserData = {
  email: "",
  name: "",
  password: "",
};

describe("Signup integration test", () => {
  let app: Hono;
  beforeEach(() => {
    app = middlewareFactory.createApp().basePath("/api");
    app.route("/", user);
  });

  it("正しいデータで成功する", async () => {
    const response = await app.request("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        email: correctUserData.email,
        name: correctUserData.name,
        password: correctUserData.password,
      }),
    });
    expect(response.status).toBe(201);
  });
  it("バリデーションエラー時は400を返すこと", async () => {
    const response = await app.request("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        email: inValidUserData.email,
        name: inValidUserData.name,
        password: inValidUserData.password,
      }),
    });
    expect(response.status).toBe(400);
  });
  it("メールアドレスがユニークキー制約である時に失敗", async () => {
    const response = await app.request("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        email: correctUserData.email,
        name: correctUserData.name,
        password: correctUserData.password,
      }),
    });
    expect(response.status).toBe(400);
  });
});
