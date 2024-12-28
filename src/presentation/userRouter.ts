import { Hono } from "hono";
import { SignupUserUsecase } from "../application/usecase/signupUserUsecase.js";
import { UserGateway } from "../infrastructure/userGateway.js";

const user = new Hono();
const signupUserUsecase = new SignupUserUsecase(new UserGateway());

export type UserPostRequestBody = {
  email: string;
  name: string;
  password: string;
};

user.post("/signup", async (c) => {
  const userData: UserPostRequestBody = await c.req.json<UserPostRequestBody>();
  const userRes = await signupUserUsecase.run(userData);
  return c.json(userRes, 201);
});

user.get("/login", (c) => c.text("loigin"));

export default user;
