export interface TmdbSearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  media_type?: "movie" | "tv";
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResult[];
  total_pages: number;
  total_results: number;
}

export type TmdbMediaType = "movie" | "tv";

export function getTmdbPosterUrl(
  posterPath: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w780"
): string | null {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export function getTmdbTitle(result: TmdbSearchResult): string {
  return result.title || result.name || "";
}

export function getTmdbYear(result: TmdbSearchResult): string {
  const date = result.release_date || result.first_air_date;
  return date ? date.substring(0, 4) : "";
}
