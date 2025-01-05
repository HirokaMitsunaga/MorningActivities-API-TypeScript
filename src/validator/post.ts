import * as z from "zod";

export const PostModel = z.object({
  sentence: z.string().nonempty({ message: "Sentence is not empty" }),
  userId: z.number({
    required_error: "userId is required",
    invalid_type_error: "userId must be a number",
  }),
});
