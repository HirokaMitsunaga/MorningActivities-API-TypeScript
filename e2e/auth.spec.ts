import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const generateRandomEmail = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test_${timestamp}_${random}@example.com`;
};

test.describe("ログインテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.FRONT_URL as string);
  });
  test.describe("ログイン", () => {
    test("ログイン成功後にタスク一覧ページに遷移する", async ({ page }) => {
      await page.getByPlaceholder("Email address").fill("test@example.com");
      await page.getByPlaceholder("Password").fill("password123");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/login")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(201);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
    });

    test("パスワードが間違っている場合ログインできない", async ({ page }) => {
      await page.getByPlaceholder("Email address").fill("test@example.com");
      await page.getByPlaceholder("Password").fill("pass");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/login")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(400);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}`);
    });

    test("ユーザが存在しない場合ログインができない", async ({ page }) => {
      await page.getByPlaceholder("Email address").fill("nouser22@example.com");
      await page.getByPlaceholder("Password").fill("password123");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/login")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(400);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}`);
    });
  });
  test.describe("サインアップ", () => {
    test("サインアップ成功後にタスク一覧ページに遷移する", async ({ page }) => {
      await page.click('[data-testid="mode-switch"]');
      await page.getByPlaceholder("Email address").fill(generateRandomEmail());
      await page.getByPlaceholder("Password").fill("password123");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/signup")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(201);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}/todo`);
    });

    test("すでに登録されいるメールアドレスの場合ログインできない", async ({
      page,
    }) => {
      await page.click('[data-testid="mode-switch"]');
      await page
        .getByPlaceholder("Email address")
        .fill("testUser12@example.com");
      await page.getByPlaceholder("Password").fill("pass");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/signup")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(400);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}`);
    });

    test("ユーザが存在しない場合ログインができない", async ({ page }) => {
      await page.click('[data-testid="mode-switch"]');
      await page.getByPlaceholder("Email address").fill("nouser@example.com");
      await page.getByPlaceholder("Password").fill("password123");
      await page.getByPlaceholder("Name").fill("Test User");

      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.url().includes("/api/signup")
        ),
        page.getByRole("button").click(),
      ]);
      expect(response.status()).toBe(400);
      await expect(page).toHaveURL(`${process.env.FRONT_URL}`);
    });
  });
});
