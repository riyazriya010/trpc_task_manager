// app/api/debug/route.ts
import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function GET() {
  try {
    const hostname = "db.qgndfzrmesloopqzuodq.supabase.co";
    const result = await dns.lookup(hostname);
    const env = process.env.DATABASE_URL;

    return NextResponse.json({ envUsed: env?.slice(0, 30) + "...", dns: result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}
