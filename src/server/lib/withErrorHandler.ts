import { ZodError } from "zod"

export function withErrorHandler<T extends (...args: any[]) => any>(handler: T) {
  return async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (err) {
      if (err instanceof ZodError) {
        return Response.json(
          { error: err.errors[0].message },
          { status: 400 }
        )
      }

      return Response.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}