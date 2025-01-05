import * as z from "zod";

export const PostModel = z.object({
  sentence: z
    .string()
    .max(20, { message: "Title is must be 20 or fewer characters long" })
    .nonempty({ message: "Title is not empty" }),
  userId: z.number({
    required_error: "userId is required",
    invalid_type_error: "userId must be a number",
  }),
});
