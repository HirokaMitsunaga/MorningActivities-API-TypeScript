import * as z from "zod";

export const UserModel = z.object({
  email: z.string().email(),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  password: z.string(),
});
