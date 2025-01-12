import "reflect-metadata";
import { injectable, inject } from "inversify";
import { UserModel } from "../../../validator/user.js";
import { UserPostRequestBody } from "../../../presentation/auth/userRouter.js";
import { comparePassword } from "../../../utils/hashPassword.js";
import { UserGatewayInterface } from "../../../domain/userGatewayInterface.js";
import { sign } from "hono/jwt";
import { ValidationError } from "../../../validator/validationError.js";
import { getContext } from "hono/context-storage";
import { Logger } from "../../../utils/Logger.js";
import { TYPES } from "../../../dependencyInjection/types.js";

export class LoginUserUsecase {
  private logger = Logger.getInstance();

  // constructor(private _userGateway: UserGatewayInterface) {}
  constructor(
    @inject(TYPES.UserGateway) private _userGateway: UserGatewayInterface
  ) {}

  async run(userData: UserPostRequestBody): Promise<string> {
    const context = getContext();
    const requestId = context?.get("requestId");

    try {
      this.logger.info("Login attempt started", {
        requestId,
        email: userData.email,
      });

      const userValidation = UserModel.safeParse(userData);
      if (!userValidation.success) {
        const errorMessage = userValidation.error.errors
          .map((err) => err.message)
          .join(", ");
        this.logger.warn("Validation failed", {
          requestId,
          email: userData.email,
          error: errorMessage,
        });
        throw new Error(errorMessage);
      }

      //ユーザの存在チェック
      const user = await this._userGateway.getUserByEmail(userData.email);
      if (!user) {
        this.logger.warn("User not found", {
          requestId,
          email: userData.email,
        });
        throw new ValidationError("Not found user");
      }
      //パスワードのハッシュ確認
      const isPasswordValid = await comparePassword(
        userData.password,
        user.password
      );
      if (!isPasswordValid) {
        this.logger.warn("Invalid password attempt", {
          requestId,
          email: userData.email,
          userId: user.id,
        });
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
    } catch (error) {
      this.logger.error(
        "Login process failed",
        error instanceof Error ? error : new Error("Unknown error"),
        {
          requestId,
          email: userData.email,
        }
      );
      throw error;
    }
  }
}
