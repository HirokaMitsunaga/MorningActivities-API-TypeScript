import { PrismaClient } from "@prisma/client";
import { middlewareFactory } from "../../../src/middleware/appMiddleware.js";
import user from "../../../src/presentation/auth/userRouter.js";
import task from "../../../src/presentation/task/taskRouter.js";

import { Hono } from "hono";

const prisma = new PrismaClient();

const loginData = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

//userIdはloginDataの値で登録したユーザのid(DBの中身を参照してユーザIDをしていする)
const createTaskData = {
  title: "test",
  userId: 6,
  scheduleMinutes: 20,
  actualMinutes: 23,
};

describe("Task integration test", () => {
  let app: Hono;
  let authCookie: string;
  let taskId: number; // クラススコープで変数を定義

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
  it("タスクの削除が成功する", async () => {
    const response = await app.request(`/api/task/${taskId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId: createTaskData.userId, taskId: taskId }),
      headers: {
        Cookie: authCookie,
      },
    });
    console.log(response);
    expect(response.status).toBe(201);
  });

  it("cookieに認証情報がない場合はエラーを返す", async () => {
    const response = await app.request(`/api/task/${taskId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId: createTaskData.userId, taskId: taskId }),
    });
    expect(response.status).toBe(401);
  });
});
