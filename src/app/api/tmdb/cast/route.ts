import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  profileUrl: string | null;
  profileUrlHd: string | null;
  order: number;
}

/**
 * GET /api/tmdb/cast
 * Fetch cast (actors/characters) for a movie or TV show
 * Query params: id (TMDB ID), type (movie|tv)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";

  if (!id) {
    return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "TMDB API key eksik" }, { status: 500 });
  }

  try {
    const creditsUrl = `${TMDB_BASE_URL}/${type}/${id}/credits?api_key=${TMDB_API_KEY}&language=tr-TR`;
    const response = await fetch(creditsUrl);

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    const cast: CastMember[] = (data.cast || [])
      .filter((member: { profile_path: string | null }) => member.profile_path) // Only with photos
      .slice(0, 20) // First 20 cast members
      .map((member: { id: number; name: string; character: string; profile_path: string; order: number }) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profile_path: member.profile_path,
        profileUrl: member.profile_path ? `${TMDB_IMAGE_BASE}/w185${member.profile_path}` : null,
        profileUrlHd: member.profile_path ? `${TMDB_IMAGE_BASE}/h632${member.profile_path}` : null,
        order: member.order,
      }));

    return NextResponse.json({
      cast,
      total: cast.length,
    });
  } catch (error) {
    console.error("TMDB cast fetch error:", error);
    return NextResponse.json(
      { error: "Oyuncu kadrosu alınamadı" },
      { status: 500 }
    );
  }
}
