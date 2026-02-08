"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Film, Tv, Loader2 } from "lucide-react";
import { useTmdbSearch } from "@/hooks/use-tmdb-search";
import { getTmdbPosterUrl, getTmdbTitle, getTmdbYear } from "@/types/tmdb";
import type { TmdbSearchResult, TmdbMediaType } from "@/types/tmdb";

interface TmdbSearchProps {
  onSelect: (result: TmdbSearchResult) => void;
}

export function TmdbSearch({ onSelect }: TmdbSearchProps) {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<TmdbMediaType>("movie");
  const { results, isLoading, error, search, clearResults } = useTmdbSearch();

  const handleSearch = (value: string) => {
    setQuery(value);
    search(value, mediaType);
  };

  const handleTypeChange = (type: TmdbMediaType) => {
    setMediaType(type);
    if (query.trim().length >= 2) {
      search(query, type);
    }
  };

  const handleSelect = (result: TmdbSearchResult) => {
    onSelect(result);
    setQuery(getTmdbTitle(result));
    clearResults();
  };

  return (
    <div className="space-y-3">
      <Label>Film / Dizi Ara</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mediaType === "movie" ? "default" : "outline"}
          onClick={() => handleTypeChange("movie")}
          className="gap-1.5"
        >
          <Film className="h-3.5 w-3.5" />
          Film
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mediaType === "tv" ? "default" : "outline"}
          onClick={() => handleTypeChange("tv")}
          className="gap-1.5"
        >
          <Tv className="h-3.5 w-3.5" />
          Dizi
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Film veya dizi adı yazın..."
          className="pl-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results.length > 0 && (
        <div className="max-h-72 overflow-y-auto rounded-lg border bg-card">
          {results.slice(0, 8).map((result) => {
            const posterUrl = getTmdbPosterUrl(result.poster_path, "w185");
            const title = getTmdbTitle(result);
            const year = getTmdbYear(result);

            return (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 border-b px-3 py-2.5 text-left transition-colors hover:bg-accent last:border-b-0"
              >
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={title}
                    className="h-16 w-11 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-11 items-center justify-center rounded bg-muted">
                    <Film className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-sm">{title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {year && (
                      <Badge variant="secondary" className="text-xs">
                        {year}
                      </Badge>
                    )}
                    {result.vote_average > 0 && (
                      <span className="text-xs text-amber-500 font-medium">
                        ★ {result.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
