import { z } from "zod"

export type ID = bigint
(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}
export const ID = {
  zod: () =>
    z
      .union([z.bigint(), z.string()])
      .transform((val) => (typeof val === "string" ? BigInt(val) : val))
      .refine((val) => val >= 0n, { message: "ID must be a positive bigint" }),
}   
