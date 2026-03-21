import { ID } from "@/types/ID";
import z from "zod";

export const UserValidator = z.object({
    userId: ID.zod()
  })