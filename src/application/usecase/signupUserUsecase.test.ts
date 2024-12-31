import { UserPostRequestBody } from "../../presentation/userRouter.js";
import { UserGatewayInterface } from "../../domain/userGatewayInterface.js";
import { SignupUserUsecase } from "./signupUserUsecase.js";
import { User } from "@prisma/client";

describe("SignupUserUsecase Test", () => {
  let mockUserGateway: {
    insert: jest.Mock<Promise<User>, [UserPostRequestBody]>;
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
    };
    signupUserUsecase = new SignupUserUsecase(mockUserGateway);
  });

  it("データが登録される", async () => {
    await signupUserUsecase.run(userData);
    expect(mockUserGateway.insert).toHaveBeenCalledWith(userData);
  });

  it("データが登録されない", async () => {
    mockUserGateway.insert.mockRejectedValue(new Error("Database error"));
    await expect(signupUserUsecase.run(userData)).rejects.toThrow(
      "Database error"
    );
  });
});
