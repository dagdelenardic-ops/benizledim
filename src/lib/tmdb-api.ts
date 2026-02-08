import type { TmdbSearchResponse, TmdbMediaType } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) throw new Error("TMDB_ACCESS_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function searchTmdb(
  query: string,
  type: TmdbMediaType = "movie"
): Promise<TmdbSearchResponse> {
  const endpoint = type === "movie" ? "search/movie" : "search/tv";
  const url = `${TMDB_BASE_URL}/${endpoint}?query=${encodeURIComponent(query)}&language=tr-TR&page=1`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Get backdrop/still images for a movie or TV show
 * Returns high-res scene images perfect for replik backgrounds
 */
export async function getTmdbImages(
  id: number,
  type: TmdbMediaType = "movie"
): Promise<{ backdrops: TmdbImage[]; posters: TmdbImage[] }> {
  const endpoint = type === "movie" ? `movie/${id}/images` : `tv/${id}/images`;
  const url = `${TMDB_BASE_URL}/${endpoint}?include_image_language=null,en,tr`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`TMDB Images API error: ${res.status}`);
  }
  const data = await res.json();
  return {
    backdrops: (data.backdrops || []).slice(0, 20),
    posters: (data.posters || []).slice(0, 10),
  };
}

export interface TmdbImage {
  file_path: string;
  width: number;
  height: number;
  vote_average: number;
  aspect_ratio: number;
}
