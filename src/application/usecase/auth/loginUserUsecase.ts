import { UserModel } from "../../../validator/user.js";
import { UserPostRequestBody } from "../../../presentation/userRouter.js";
import { comparePassword } from "../../../utils/hashPassword.js";
import { UserGatewayInterface } from "../../../domain/userGatewayInterface.js";
import { sign } from "hono/jwt";
import { ValidationError } from "../../../validator/validationError.js";

export class LoginUserUsecase {
  constructor(private _userGateway: UserGatewayInterface) {}
  async run(userData: UserPostRequestBody): Promise<string> {
    const userValidation = UserModel.safeParse(userData);
    if (!userValidation.success) {
      throw new Error(
        userValidation.error.errors.map((err) => err.message).join(", ")
      );
    }
    //ユーザの存在チェック
    const user = await this._userGateway.getUserByEmail(userData.email);
    if (!user) {
      throw new ValidationError("Not found user");
    }
    //パスワードのハッシュ確認
    const isPasswordValid = await comparePassword(
      userData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new ValidationError("Password is incorrect");
    }

    //JWTの設定
    const payload = {
      sub: user.id,
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24時間
    };
    //TODO 後で.envから呼び出すように変更
    const secret = "jwtsecret";
    const token = await sign(payload, secret);

    return token;
  }
}
