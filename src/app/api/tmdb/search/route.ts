import { NextRequest, NextResponse } from "next/server";
import { searchTmdb } from "@/lib/tmdb-api";
import type { TmdbMediaType } from "@/types/tmdb";

export async function POST(request: NextRequest) {
  try {
    const { query, type } = (await request.json()) as {
      query: string;
      type?: TmdbMediaType;
    };

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const data = await searchTmdb(query.trim(), type || "movie");
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
