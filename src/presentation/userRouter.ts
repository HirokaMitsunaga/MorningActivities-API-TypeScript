import { Hono } from "hono";
import { SignupUserUsecase } from "../application/usecase/signupUserUsecase.js";
import { UserGateway } from "../infrastructure/userGateway.js";
import { PrismaClient } from "@prisma/client";
import { LoginUserUsecase } from "../application/usecase/loginUserUsecase.js";
import { setSignedCookie } from "hono/cookie";
import { UserModel } from "../validator/user.js";
import { ValidationError } from "../validator/validationError.js";

const user = new Hono();
const prismaClient = new PrismaClient();
const signupUserUsecase = new SignupUserUsecase(new UserGateway(prismaClient));
const loginUserUsecase = new LoginUserUsecase(new UserGateway(prismaClient));

export type UserPostRequestBody = {
  email: string;
  name: string;
  password: string;
};

user.post("/signup", async (c) => {
  try {
    const userData = await c.req.json<UserPostRequestBody>();

    const userValidation = UserModel.safeParse(userData);
    if (!userValidation.success) {
      throw new ValidationError(
        userValidation.error.errors.map((err) => err.message).join(", ")
      );
    }
    const userRes = await signupUserUsecase.run(userData);
    return c.json(userRes, 201);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

user.post("/login", async (c) => {
  try {
    const userData = await c.req.json<UserPostRequestBody>();
    const userValidation = UserModel.safeParse(userData);
    if (!userValidation.success) {
      throw new ValidationError(
        userValidation.error.errors.map((err) => err.message).join(", ")
      );
    }
    const tokenString = await loginUserUsecase.run(userData);
    //TODO: 後で.envからcookieSecretを設定するようにする
    await setSignedCookie(c, "token", tokenString, "cookieSecret", {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
      sameSite: "Lax",
    });
    return c.json({ message: "Login successful" }, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to login" }, 500);
  }
});

export default user;
