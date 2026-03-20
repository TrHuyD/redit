import z from "zod";

export const UserValidator = z.object({
    userId: z.string(),
  })