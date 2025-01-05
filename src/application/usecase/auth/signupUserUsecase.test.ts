import { UserPostRequestBody } from "../../../presentation/auth/userRouter.js";
import { SignupUserUsecase } from "./signupUserUsecase.js";
import { User } from "@prisma/client";

describe("SignupUserUsecase Test", () => {
  let mockUserGateway: {
    insert: jest.Mock<Promise<User>, [UserPostRequestBody]>;
    getUserByEmail: jest.Mock<Promise<User | undefined>, [string]>;
  };
  let signupUserUsecase: SignupUserUsecase;

  const userData: UserPostRequestBody = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  beforeEach(() => {
    mockUserGateway = {
      insert: jest.fn(),
      getUserByEmail: jest.fn(),
    };
    signupUserUsecase = new SignupUserUsecase(mockUserGateway);
  });

  it("データが登録される", async () => {
    await signupUserUsecase.run(userData);
    expect(mockUserGateway.insert).toHaveBeenCalledWith(userData);
  });

  it("既に登録されているメールアドレスの場合はエラーを投げる", async () => {
    const existingUserData = {
      id: 1,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUserGateway.getUserByEmail.mockResolvedValueOnce(existingUserData);
    await expect(signupUserUsecase.run(userData)).rejects.toThrow(
      "This email address is already registered"
    );
    expect(mockUserGateway.getUserByEmail).toHaveBeenCalledWith(userData.email);
  });

  it("データが登録されない", async () => {
    mockUserGateway.insert.mockRejectedValue(new Error("Database error"));
    await expect(signupUserUsecase.run(userData)).rejects.toThrow(
      "Database error"
    );
  });
});
