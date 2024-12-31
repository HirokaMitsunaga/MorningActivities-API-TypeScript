import { Hono } from "hono";
import { SignupUserUsecase } from "../application/usecase/signupUserUsecase.js";
import { UserGateway } from "../infrastructure/userGateway.js";
import { PrismaClient } from "@prisma/client/extension";

const user = new Hono();
const prismaClient = PrismaClient();
const signupUserUsecase = new SignupUserUsecase(new UserGateway(prismaClient));

export type UserPostRequestBody = {
  email: string;
  name: string;
  password: string;
};

user.post("/signup", async (c) => {
  try {
    const userData: UserPostRequestBody =
      await c.req.json<UserPostRequestBody>();
    const userRes = await signupUserUsecase.run(userData);
    return c.json(userRes, 201);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to sign up" },
      500
    );
  }
});

user.get("/login", (c) => c.text("loigin"));

export default user;
