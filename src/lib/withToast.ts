import { toast } from "sonner"

export function withToast<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await fn(...args)
    } catch (error: any) {
      let message =
        error?.response?.data?.message ??
        error?.response?.data ??
        error?.message ??
        "Something went wrong"

      if (typeof message === "object") {
        message = JSON.stringify(message)
      }

      toast.error(message)
      throw error
    }
  }
}