import { User } from "@prisma/client";
import { UserPostRequestBody } from "../../../presentation/auth/userRouter.js";
import { hashPassword } from "../../../utils/hashPassword.js";
import { UserGatewayInterface } from "../../../domain/userGatewayInterface.js";
import { ValidationError } from "../../../validator/validationError.js";

export class SignupUserUsecase {
  constructor(private _userGateway: UserGatewayInterface) {}
  async run(userData: UserPostRequestBody): Promise<User> {
    const existingUser = await this._userGateway.getUserByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError("This email address is already registered");
    }
    userData.password = await hashPassword(userData.password);
    const userRecord = await this._userGateway.insert(userData);
    return userRecord;
  }
}
