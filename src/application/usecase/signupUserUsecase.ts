import { User } from "@prisma/client";
import { UserModel } from "../../validator/user.js";
import { UserPostRequestBody } from "../../presentation/userRouter.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { UserGatewayInterface } from "../../domain/userGatewayInterface.js";

export class SignupUserUsecase {
  constructor(private _userGateway: UserGatewayInterface) {}
  async run(userData: UserPostRequestBody): Promise<User> {
    const userValidation = UserModel.safeParse(userData);
    if (!userValidation.success) {
      throw new Error(
        userValidation.error.errors.map((err) => err.message).join(", ")
      );
    }
    //パスワードのhash化
    userData.password = await hashPassword(userData.password);
    const userRecord = await this._userGateway.insert(userData);
    return userRecord;
  }
}
