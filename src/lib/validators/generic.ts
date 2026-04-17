import z from "zod";

export const zStringRequired = (field: string) =>
  z.string({
    required_error: `${field} is required`,
    invalid_type_error: `${field} must be a string`,
  });
export const zLimit = z.coerce.number().int().positive().max(50).optional();
export const zCursorId = z.coerce.bigint().optional();
export const zMediaKeys = z.array(z.string()).default([]);

