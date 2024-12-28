import * as z from "zod";

export const UserModel = z.object({
  email: z.string().email().nonempty(),
  name: z.string().nonempty({ message: "name is not empty" }),
  password: z.string().nonempty({ message: "password is not empty" }),
});
