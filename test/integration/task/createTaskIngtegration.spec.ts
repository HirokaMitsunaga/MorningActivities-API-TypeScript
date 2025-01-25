import { middlewareFactory } from "../../../src/middleware/appMiddleware.js";
import user from "../../../src/presentation/auth/userRouter.js";
import task from "../../../src/presentation/task/taskRouter.js";

import { Hono } from "hono";

const loginData = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

const correctTaskData = {
  title: "test",
  scheduleMinutes: 20,
  actualMinutes: 23,
};

const invalidTaskData = {
  title: "testtesttesttesttesttesttesttesttesttesttesttesttest",
  scheduleMinutes: 20,
  actualMinutes: 23,
};

describe("Login integration test", () => {
  let app: Hono;
  let authCookie: string;

  beforeEach(async () => {
    app = middlewareFactory.createApp().basePath("/api");
    app.route("/", user);
    app.route("/", task);

    const loginResponse = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
    authCookie = loginResponse.headers.get("Set-Cookie") || "";
  });

  it("タスクの作成が成功する", async () => {
    const response = await app.request("/api/task", {
      method: "POST",
      body: JSON.stringify(correctTaskData),
      headers: {
        Cookie: authCookie,
      },
    });
    expect(response.status).toBe(201);
  });
  it("バリデーションエラー時は400を返すこと", async () => {
    const response = await app.request("/api/task", {
      method: "POST",
      body: JSON.stringify(invalidTaskData),
      headers: {
        Cookie: authCookie,
      },
    });
    expect(response.status).toBe(400);
  });
  it("cookieに認証情報がない場合はエラーを返す", async () => {
    const response = await app.request("/api/task", {
      method: "POST",
      body: JSON.stringify(invalidTaskData),
    });
    expect(response.status).toBe(401);
  });
});
