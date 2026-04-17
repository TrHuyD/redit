import { ZodError } from "zod";

export function withErrorHandler<TArgs extends unknown[], TReturn>(handler: (...args: TArgs) => Promise<TReturn>) {
  return async (...args: TArgs): Promise<TReturn | Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      return handleError(err)
    }
  };
}

export function handleError(err: unknown): Response {
  console.error(err);

  if (err instanceof ZodError) {
    return Response.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  if (err instanceof Error) {
    return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
  }

  return Response.json({ error: "Unknown error occurred" }, { status: 500 });
}
