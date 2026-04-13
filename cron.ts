import cron from "node-cron";
import "dotenv/config";
const SUBREDDITS = ["javascript", "react", "unpopularopinion", "abc", "literature"];
const runJob = async () => {
  try {
    const password = process.env.NEXTAUTH_SECRET;
    if (!password) throw new Error("Missing CRON_PASSWORD in env");
    
    const url = `http://localhost:3000/api/clawer/top-posts?subreddit=${SUBREDDITS.join(",")}&limit=4&password=${password}`;
    const res = await fetch(url);
    if (!res.ok)  throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    console.log("Cron success:", new Date().toISOString(), data);
  } catch (err) {
    console.error(" Cron error:", err);
  }
};
cron.schedule("0 * * * *", () => {
  console.log("Running cron job...");
  runJob();
});