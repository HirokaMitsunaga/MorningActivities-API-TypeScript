import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("タスク更新テスト", () => {
  let taskId: string; // taskIdをテストスイート全体で使用可能にする

  test.beforeEach(async ({ page }) => {
    //ログイン
    await page.goto(process.env.FRONT_URL as string);
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByRole("button").click();
    //タスクの作成
    await page.click('button[aria-label="タスクを作成"]');
    await page.getByPlaceholder("タスク名").fill("test");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/task")),
      await page.click('button[aria-label="タスクを保存"]'),
    ]);
    const responseData = await response.json();
    taskId = responseData.id; // taskIdに値を代入
  });

  test("タスクが更新される", async ({ page }) => {
    await page.waitForURL(`${process.env.FRONT_URL}/todo`);
    await page.locator('li >> svg[aria-label="タスクを更新"]').first().click();

    await page.getByPlaceholder("タスク名").fill("test update");
    await page.getByPlaceholder("予定時間（分）").fill("40");
    await page.getByPlaceholder("実際の時間（分）").fill("40");
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/task/") &&
          response.request().method() === "PUT"
      ),
      page.click('button[aria-label="タスクを保存"]'),
    ]);
    expect(response.status()).toBe(201);
    await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
  });

  test("バリデーションエラーの時タスクが更新が失敗する", async ({ page }) => {
    await page.waitForURL(`${process.env.FRONT_URL}/todo`);
    await page.locator('li >> svg[aria-label="タスクを更新"]').first().click();
    await page
      .getByPlaceholder("タスク名")
      .fill("testtesttesttesttesttesttesttesttesttesttesttesttest");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/task/") &&
          response.request().method() === "PUT"
      ),
      page.click('button[aria-label="タスクを保存"]'),
    ]);
    expect(response.status()).toBe(400);
    await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
  });
  test("cookieに認証情報がない場合はエラーを返す", async ({
    page,
    context,
  }) => {
    await page.waitForURL(`${process.env.FRONT_URL}/todo`);
    await context.clearCookies();
    await page.click('svg[aria-label="タスクを更新"]');
    await page.getByPlaceholder("タスク名").fill("test");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/api/task/") &&
          response.request().method() === "PUT"
      ),
      page.click('button[aria-label="タスクを保存"]'),
    ]);
    expect(response.status()).toBe(401);
    await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
  });
});
