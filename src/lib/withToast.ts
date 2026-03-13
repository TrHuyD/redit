import { toast } from "sonner"

export function withToast<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult | undefined> => {
    try {
      return await fn(...args)
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"

      toast.error(message)
      return undefined
    }
  }
}