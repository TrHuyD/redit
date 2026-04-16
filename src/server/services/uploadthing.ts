import { db } from "@/lib/db";
import { Result } from "@/lib/Result";
import { UTApi } from "uploadthing/server";
import { qstash } from "./qstash";
const utapi = new UTApi();
export async function createMediaImg(input: CreateMediaInput): Promise<Result<{ key: string; url: string }>> {
  const { key} = input;
  try {
    const media = await db.mediaImg.create({ data: input });
    return { ok: true, data: { key: media.key, url: media.url } };
  } catch (err: any) {
    try {
      await qstash.publishJSON({
        url: `${process.env.APP_URL}/api/jobs/delete-uploadthing`,
        body: { key },
        retries: 3,
      });
    } catch (deleteErr) {}
    return {
      ok: false,
      error: {code: err?.code,message: "Failed to create media image",},};}
}
export async function createMediaImgPost(input: CreateMediaInput): Promise<Result<{ key: string; url: string }>> {
    const { key} = input;
    try {
      const media = await db.mediaImgPost.create({ data: input });
      return { ok: true, data: { key: media.key, url: media.url } };
    } catch (err: any) {
      try {
        await qstash.publishJSON({
          url: `${process.env.APP_URL}/api/jobs/delete-uploadthing`,
          body: { key },
          retries: 3,
        });
      } catch (deleteErr) {}
      return {
        ok: false,
        error: {code: err?.code,message: "Failed to create media image",},};}
  }
  