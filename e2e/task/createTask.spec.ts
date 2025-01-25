import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("タスク作成テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.FRONT_URL as string);
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByRole("button").click();
  });
  test("タスクが作成される", async ({ page }) => {
    await page.click('button[aria-label="タスクを作成"]');
    await page.getByPlaceholder("タスク名").fill("test");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/task")),
      await page.click('button[aria-label="タスクを保存"]'),
    ]);
    expect(response.status()).toBe(201);
    await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
  });
  test("バリデーションエラーの時タスクが作成が失敗する", async ({ page }) => {
    await page.click('button[aria-label="タスクを作成"]');
    await page
      .getByPlaceholder("タスク名")
      .fill("testtesttesttesttesttesttesttesttesttesttesttesttest");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/task")),
      await page.click('button[aria-label="タスクを保存"]'),
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
    await page.click('button[aria-label="タスクを作成"]');
    await page.getByPlaceholder("タスク名").fill("test");
    await page.getByPlaceholder("予定時間（分）").fill("20");
    await page.getByPlaceholder("実際の時間（分）").fill("20");
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/task")),
      await page.click('button[aria-label="タスクを保存"]'),
    ]);
    expect(response.status()).toBe(401);
    await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
  });
});
