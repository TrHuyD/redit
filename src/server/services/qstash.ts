import { Client } from "@upstash/qstash";

export const qstash = new Client({
  baseUrl: "https://qstash-eu-central-1.upstash.io",
  token: process.env.QSTASH_TOKEN!,
});