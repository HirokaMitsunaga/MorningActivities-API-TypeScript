import { User } from "@prisma/client";
import { UserGateway } from "../../infrastructure/userGateway.js";
import { UserModel } from "../../validator/user.js";
import { UserPostRequestBody } from "../../presentation/userRouter.js";
const userGateway = new UserGateway();

export class SignupUserUsecase {
  async run(userData: UserPostRequestBody): Promise<User> {
    const userValidation = UserModel.safeParse(userData);
    if (!userValidation.success) {
      throw new Error(
        userValidation.error.errors.map((err) => err.message).join(", ")
      );
    }
    const userRecord = await userGateway.insert(userData);
    return userRecord; // 挿入したユーザー情報を返す
  }
}
