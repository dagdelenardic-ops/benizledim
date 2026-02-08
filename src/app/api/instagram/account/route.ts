import { NextResponse } from "next/server";
import { getAccountInfo } from "@/lib/instagram-api";

export async function GET() {
  try {
    const info = await getAccountInfo();
    return NextResponse.json(info);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
