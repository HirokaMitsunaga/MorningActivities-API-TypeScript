import { Hono } from "hono";
import { SignupUserUsecase } from "../application/usecase/signupUserUsecase.js";

const user = new Hono();
const signupUserUsecase = new SignupUserUsecase();

type UserPostRequestBody = {
  email: string;
  name: string;
  password: string;
};

user.post("/signup", async (c) => {
  const { email, name, password } = await c.req.json<UserPostRequestBody>();
  const userRes = await signupUserUsecase.run(email, name, password);
  return c.json(userRes, 201);
});

user.get("/login", (c) => c.text("loigin"));

export default user;
