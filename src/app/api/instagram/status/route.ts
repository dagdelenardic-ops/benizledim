import { NextRequest, NextResponse } from "next/server";
import { checkContainerStatus } from "@/lib/instagram-api";

export async function GET(request: NextRequest) {
  try {
    const containerId = request.nextUrl.searchParams.get("containerId");
    if (!containerId) {
      return NextResponse.json({ error: "containerId gerekli" }, { status: 400 });
    }
    const status = await checkContainerStatus(containerId);
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
