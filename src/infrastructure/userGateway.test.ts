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

  // TODO　ユーニーク制約のテストを書く
  // 下記で同じemaiを登録したらユニークキー制約でエラーになるテストを書いたが、違うemaiで登録してもテストが通ってしまうので改善が必要
  // it("should throw an error when inserting fails due to unique constraint", async () => {
  //   const userData1: UserPostRequestBody = {
  //     email: "test@example.com",
  //     name: "Test User",
  //     password: "password123",
  //   };

  //   const expectedUser1 = {
  //     id: 1,
  //     ...userData1,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   };

  //   // 最初のユーザーの挿入が成功することをモック
  //   prismaMock.user.create.mockResolvedValue(expectedUser1);
  //   const userRecord1 = await userGateway.insert(userData1);
  //   expect(userRecord1).toEqual(expectedUser1);
  //   expect(prismaMock.user.create).toHaveBeenCalledWith({ data: userData1 });

  //   // 2つ目のユーザーのデータ
  //   const userData2: UserPostRequestBody = {
  //     email: "another@example.com", // 異なるメールアドレス
  //     name: "Another User",
  //     password: "password456",
  //   };

  //   // ユニーク制約違反のエラーをモック
  //   prismaMock.user.create.mockRejectedValue(
  //     new Error("Unique constraint failed on the fields: (`email`)")
  //   );
  //   // 2つ目のユーザーの挿入が失敗することを期待
  //   await expect(userGateway.insert(userData2)).rejects.toThrow(
  //     "Unique constraint failed on the fields: (`email`)"
  //   );
  // });

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
