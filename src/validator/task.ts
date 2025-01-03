import * as z from "zod";

export const TaskModel = z.object({
  title: z
    .string()
    .max(20, { message: "Title is must be 20 or fewer characters long" })
    .nonempty({ message: "Title is not empty" }),
  userId: z.number({
    required_error: "userId is required",
    invalid_type_error: "userId must be a number",
  }),
  scheduleMinnutes: z
    .number({
      invalid_type_error: "scheduleMinnutes must be a number",
    })
    .min(0, { message: "scheduleMinnutes must be greater than or equal to 0" })
    .optional(),
  actualMinutes: z
    .number({
      invalid_type_error: "actualMinutes must be a number",
    })
    .min(0, { message: "actualMinutes must be greater than or equal to 0" })
    .optional(),
});
