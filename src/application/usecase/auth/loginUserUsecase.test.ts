import { Context } from "hono";
import { UserPostRequestBody } from "../../../presentation/auth/userRouter.js";
import { comparePassword } from "../../../utils/hashPassword.js";
import { LoginUserUsecase } from "./loginUserUsecase.js";
import { User } from "@prisma/client";
import { getContext } from "hono/context-storage";
import { Logger } from "../../../utils/Logger.js";

// モジュールのモック化
jest.mock("../../../utils/hashPassword.js");
jest.mock("hono/context-storage");
jest.mock("../../../utils/Logger.js");

// モック化された関数の取得
const mockComparePassword = jest.mocked(comparePassword);
const mockGetContext = jest.mocked(getContext);

describe("LoginUserUsecase Test", () => {
  let mockUserGateway: {
    insert: jest.Mock<Promise<User>, [UserPostRequestBody]>;
    getUserByEmail: jest.Mock<Promise<User | undefined>, [string]>;
  };
  let loginUserUsecase: LoginUserUsecase;
  let mockLoggerInstance: jest.Mocked<Logger>;

  const userData: UserPostRequestBody = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  const mockUserData = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    password: "hashedPassword123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUserGateway = {
      insert: jest.fn(),
      getUserByEmail: jest.fn(),
    };

    // Loggerのモックインスタンスを作成
    mockLoggerInstance = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    // LoggerのgetInstanceメソッドをモック化
    jest.spyOn(Logger, "getInstance").mockReturnValue(mockLoggerInstance);

    loginUserUsecase = new LoginUserUsecase(mockUserGateway);
    mockComparePassword.mockReset();

    // getContextのモックを設定
    mockGetContext.mockReturnValue({
      get: jest.fn().mockReturnValue("test-request-id"),
    } as any);
  });

  it("正しいパスワードでログインが成功する", async () => {
    mockComparePassword.mockResolvedValue(true);
    mockUserGateway.getUserByEmail.mockResolvedValue(mockUserData);
    const result = await loginUserUsecase.run(userData);
    expect(mockUserGateway.getUserByEmail).toHaveBeenCalledWith(userData.email);
    expect(result).toBeTruthy;
  });
  it("ユーザが存在せずログインが失敗", async () => {
    mockComparePassword.mockResolvedValue(true);
    mockUserGateway.getUserByEmail.mockResolvedValue(undefined);
    await expect(loginUserUsecase.run(userData)).rejects.toThrow(
      "Not found user"
    );
  });
  it("パスワードが違いログインが失敗", async () => {
    mockComparePassword.mockResolvedValue(false);
    mockUserGateway.getUserByEmail.mockResolvedValue(mockUserData);
    await expect(loginUserUsecase.run(userData)).rejects.toThrow(
      "Password is incorrect"
    );
  });
});
