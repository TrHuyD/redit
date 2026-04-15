import { ZodError } from "zod";

export function withErrorHandler<TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn | Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return Response.json({ error: err.errors[0].message }, { status: 400 });
      }
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}