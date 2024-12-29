import { UserGateway } from "./userGateway.js";
import { UserPostRequestBody } from "../presentation/userRouter.js";
import { PrismaClient } from "@prisma/client";

describe("UserGateway", () => {
  let userGateway: UserGateway;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        create: jest.fn(),
      },
    };

    userGateway = new UserGateway(mockPrisma);
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
    mockPrisma.user.create.mockResolvedValue(expectedUser);

    const userRecord = await userGateway.insert(userData);

    expect(userRecord).toEqual(expectedUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userData });
  });

  it("should throw an error when inserting fails", async () => {
    const userData: UserPostRequestBody = {
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    };

    mockPrisma.user.create.mockRejectedValue(new Error("Database error"));

    await expect(userGateway.insert(userData)).rejects.toThrow(
      "Database error"
    );
  });
});
