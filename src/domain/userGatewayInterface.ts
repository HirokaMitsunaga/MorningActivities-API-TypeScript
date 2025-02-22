import { User } from "@prisma/client";
import { UserPostRequestBody } from "../presentation/auth/userRouter.js";

export interface UserGatewayInterface {
  insert(userData: UserPostRequestBody): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
