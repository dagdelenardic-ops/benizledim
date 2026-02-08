"use client";

import { useState, useCallback, useRef } from "react";
import type { TmdbSearchResult, TmdbMediaType } from "@/types/tmdb";

export function useTmdbSearch() {
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback((query: string, type: TmdbMediaType = "movie") => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tmdb/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim(), type }),
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      } catch {
        setError("Arama sırasında bir hata oluştu");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clearResults };
}
