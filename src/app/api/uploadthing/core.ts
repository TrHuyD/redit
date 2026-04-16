import { getAuthToken } from "@/lib/auth";
import { getId } from "@/lib/utils";
import { createMediaImgPost } from "@/server/services/uploadthing";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const token = await getAuthToken();
      if (!token) throw new UploadThingError("Unauthorized");
      const userId = await getId(token);
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await createMediaImgPost({
        key: file.key,
        url: file.ufsUrl,
        createdBy: metadata.userId,
      });
      return {
        ufsUrl: file.ufsUrl,
        key:file.key
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
