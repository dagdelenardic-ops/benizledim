import { NextRequest, NextResponse } from "next/server";
import { getTmdbImages } from "@/lib/tmdb-api";
import type { TmdbMediaType } from "@/types/tmdb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = (searchParams.get("type") || "movie") as TmdbMediaType;

    if (!id) {
      return NextResponse.json({ error: "id parametresi gerekli" }, { status: 400 });
    }

    const data = await getTmdbImages(parseInt(id), type);

    // Return backdrop URLs ready to use
    const backdrops = data.backdrops.map((img) => ({
      url: `https://image.tmdb.org/t/p/w1280${img.file_path}`,
      urlHd: `https://image.tmdb.org/t/p/original${img.file_path}`,
      width: img.width,
      height: img.height,
      score: img.vote_average,
    }));

    return NextResponse.json({ backdrops, total: backdrops.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Görseller alınamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
