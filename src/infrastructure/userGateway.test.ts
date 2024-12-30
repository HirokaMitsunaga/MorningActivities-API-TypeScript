import { UserGateway } from "./userGateway.js";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { prismaMock } from "../singleton.js";

describe("UserGateway", () => {
  let userGateway: UserGateway;

  beforeAll(() => {
    userGateway = new UserGateway(prismaMock);
  });

  it("should insert a user successfully", async () => {
    const userData: UserPostRequestBody = {
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    };

    const expectedUser = {
      id: 1,
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
    };
    prismaMock.user.create.mockResolvedValue(expectedUser);

    const userRecord = await userGateway.insert(userData);

    expect(userRecord).toEqual(expectedUser);
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: userData });
  });

  it("should throw an error when inserting fails", async () => {
    const userData: UserPostRequestBody = {
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    };

    prismaMock.user.create.mockRejectedValue(new Error("Database error"));

    await expect(userGateway.insert(userData)).rejects.toThrow(
      "Database error"
    );
  });
});
