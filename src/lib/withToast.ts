import { toast } from "sonner"
import { loginToast } from "./customToast"

export function withToast<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await fn(...args)
    } catch (error: any) {
      if (error.status === 401) {
        loginToast()
      } else {
        const message = await extractErrorMessage(error)
        toast.error(message)
      }
      throw error
    }
  }
}

async function extractErrorMessage(error: any): Promise<string> {
  if (error instanceof Response) {
    try {
      const body = await error.json()
      return body?.error ?? body?.message ?? `Request failed: ${error.status}`
    } catch {
      return `Request failed: ${error.status}`
    }
  }
  if (error?.response instanceof Response) {
    try {
      const body = await error.response.json()
      return body?.error ?? body?.message ?? `Request failed: ${error.response.status}`
    } catch {
      return `Request failed: ${error.response.status}`
    }
  }
  const axiosMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.response?.data
  if (axiosMessage) {
    return typeof axiosMessage === "object"
      ? JSON.stringify(axiosMessage)
      : axiosMessage
  }

  return error?.message ?? "Something went wrong"
}