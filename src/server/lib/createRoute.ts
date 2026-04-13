import { getToken, type JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { getIdnull } from "@/lib/utils";
import { withErrorHandler } from "./withErrorHandler";

type Schema = {
  parse: (input: any) => any;
};

type Infer<T> = T extends Schema ? ReturnType<T["parse"]> : undefined;

type AuthMode = "required" | "optional" | "none";

type RouteOptions<TBodySchema, TQuerySchema> = {
  auth?: AuthMode;
  schema?: {
    body?: TBodySchema;
    query?: TQuerySchema;
  };
  handler: (ctx: {
    req: NextRequest;
    userId: bigint | undefined;
    token: JWT | null;
    body: Infer<TBodySchema>;
    query: Infer<TQuerySchema>;
  }) => Promise<Response> | Response;
};
export function createRoute<
  TBodySchema extends Schema | undefined = undefined,
  TQuerySchema extends Schema | undefined = undefined
>(options: RouteOptions<TBodySchema, TQuerySchema>) {
  return withErrorHandler(async (req: NextRequest) => {
    const authMode = options.auth ?? "none";
    let token: JWT | null = null;
    let userId: bigint | undefined = undefined;
    if (authMode !== "none") {
      token = (await getToken({ req })) as JWT | null;
      const hasUser = !!token?.id;
      if (authMode === "required" && !hasUser) {
        return new Response("Unauthorized", { status: 401 });
      }
      userId = getIdnull(token);
    }
    let body: any = undefined;
    if (options.schema?.body) {
      const rawBody = await req.json();
      body = options.schema.body.parse(rawBody);
    }
    let query: any = undefined;
    if (options.schema?.query) {
      const rawQuery = Object.fromEntries(req.nextUrl.searchParams);
      query = options.schema.query.parse(rawQuery);
    }
    return options.handler({req,token,userId,body,query,});
  });
}