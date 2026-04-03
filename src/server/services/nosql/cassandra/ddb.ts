import fs from "fs";
import path from "path";
import os from "os";
import { Client } from "cassandra-driver";
export const runtime = "nodejs";
let cachedPath: string | null = null;
const BUNDLE_URL ="https://raw.githubusercontent.com/TrHuyD/key/309fdd7850cf4dddbbe544a5208fccc7ebe8ffc1/secure-connect-redit.zip";
export async function getBundlePath(): Promise<string> {
  if (cachedPath && fs.existsSync(cachedPath)) {
    return cachedPath;
  }
  const res = await fetch(BUNDLE_URL, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to download bundle");
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const filePath = path.join(os.tmpdir(), "secure-connect.zip");
  fs.writeFileSync(filePath, buffer);
  cachedPath = filePath;
  return filePath;
}

declare global {
    var _cassandraClient: import("cassandra-driver").Client | undefined;}

async function createCassandraInstance(): Promise<Client> {
    const bundlePath = await getBundlePath();
    console.log("PAAAA ",bundlePath)
    const client = new Client({
        cloud: {
        secureConnectBundle: bundlePath,
        },
        credentials: {
        username: process.env.CAS_CLIENTID!,
        password: process.env.CAS_SECRET!,
        },
    });
    await client.connect();
    return client;
}
const clientPromise =global._cassandraClient? Promise.resolve(global._cassandraClient): createCassandraInstance();
export const cassandra = clientPromise;
if (process.env.NODE_ENV !== "production") {
  clientPromise.then((client) => {global._cassandraClient = client;});
}