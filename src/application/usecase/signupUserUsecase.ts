import { User } from "@prisma/client";
import { UserGateway } from "../../infrastructure/userGateway.js";
import { UserModel } from "../../validator/user.js";
import { UserPostRequestBody } from "../../presentation/userRouter.js";
const userGateway = new UserGateway();

export class SignupUserUsecase {
  async run(userData: UserPostRequestBody): Promise<User> {
    const user = UserModel.safeParse(userData);
    if (!user) {
      throw new Error("Invalid value of signp");
    }
    const userRecord = await userGateway.insert(userData);
    return userRecord; // 挿入したユーザー情報を返す
  }
}
