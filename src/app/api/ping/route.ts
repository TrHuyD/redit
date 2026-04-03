// app/api/cassandra-test/route.ts
import { NextResponse } from "next/server";
import { cassandra } from "@/server/services/nosql/cassandra/ddb";

export async function GET() {
  try {
    const client = await cassandra;

    // simple built-in query
    const rs = await client.execute("SELECT release_version FROM system.local");

    return NextResponse.json({
      success: true,
      version: rs.rows[0]?.release_version,
      message: "Cassandra connected successfully 🚀",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}