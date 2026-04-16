import { verifySignatureEdge } from "@upstash/qstash/nextjs";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export const POST = verifySignatureEdge(async (req: Request) => {
  const { key } = await req.json();
  try {
    await utapi.deleteFiles(key);
    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response("Failed", { status: 500 });
  }
});