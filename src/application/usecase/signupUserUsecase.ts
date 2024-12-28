import { User } from "@prisma/client";
import { UserGateway } from "../../infrastructure/userGateway.js";

const userGateway = new UserGateway();

export class SignupUserUsecase {
  async run(email: string, name: string, password: string): Promise<User> {
    const userRecord = await userGateway.insert(email, name, password);
    return userRecord; // 挿入したユーザー情報を返す
  }
}
