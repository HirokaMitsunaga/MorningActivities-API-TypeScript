import { middlewareFactory } from "../../src/middleware/appMiddleware.js";
import user from "../../src/presentation/auth/userRouter.js";
import task from "../../src/presentation/task/taskRouter.js";

import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const loginData = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

//userIdはDBloginDataの値で登録したユーザのid
const createTaskData = {
  title: "test",
  userId: 4,
  scheduleMinutes: 20,
  actualMinutes: 23,
};

describe("Login integration test", () => {
  let app: Hono;
  let authCookie: string;
  let taskId: number;

  beforeEach(async () => {
    app = middlewareFactory.createApp().basePath("/api");
    app.route("/", user);
    app.route("/", task);

    const loginResponse = await app.request("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
    authCookie = loginResponse.headers.get("Set-Cookie") || "";
    const taskRes = await prisma.task.create({
      data: {
        title: createTaskData.title,
        userId: createTaskData.userId,
        scheduleMinutes: createTaskData.scheduleMinutes,
        actualMinutes: createTaskData.actualMinutes,
      },
    });
    taskId = taskRes.id;
  });

  it("タスクの取得が成功する", async () => {
    const response = await app.request(`/api/task/${taskId}`, {
      method: "GET",
      headers: {
        Cookie: authCookie,
      },
    });
    expect(response.status).toBe(201);
  });
  it("タスクが存在しない時は200を返すこと", async () => {
    await prisma.task.deleteMany({
      where: {
        userId: createTaskData.userId,
      },
    });
    const response = await app.request(`/api/task/${taskId}`, {
      method: "GET",
      headers: {
        Cookie: authCookie,
      },
    });
    expect(response.status).toBe(201);
  });
  it("cookieに認証情報がない場合はエラーを返す", async () => {
    const response = await app.request(`/api/task/${taskId}`, {
      method: "GET",
    });
    expect(response.status).toBe(401);
  });
});
