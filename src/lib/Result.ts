export type ApiError = {
  code?: string |"404"
  message: string
}
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }