import { create } from "zustand";
import type { FeedSource, FeedItem } from "@/types/feed";

interface FeedStore {
  sources: FeedSource[];
  items: FeedItem[];
  isLoading: boolean;
  error: string | null;
  selectedSourceId: string | null; // null = all sources

  setSources: (sources: FeedSource[]) => void;
  setItems: (items: FeedItem[]) => void;
  setIsLoading: (v: boolean) => void;
  setError: (err: string | null) => void;
  setSelectedSourceId: (id: string | null) => void;

  fetchSources: () => Promise<void>;
  fetchItems: (sourceId?: string | null, refresh?: boolean) => Promise<void>;
  toggleSource: (sourceId: string) => Promise<void>;
  addSource: (name: string, url: string) => Promise<void>;
  deleteSource: (sourceId: string) => Promise<void>;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  sources: [],
  items: [],
  isLoading: false,
  error: null,
  selectedSourceId: null,

  setSources: (sources) => set({ sources }),
  setItems: (items) => set({ items }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedSourceId: (selectedSourceId) => set({ selectedSourceId }),

  fetchSources: async () => {
    try {
      const res = await fetch("/api/feeds/sources");
      const data = await res.json();
      if (data.sources) set({ sources: data.sources });
    } catch {
      set({ error: "Kaynaklar yüklenemedi" });
    }
  },

  fetchItems: async (sourceId, refresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (sourceId) params.set("sourceId", sourceId);
      if (refresh) params.set("refresh", "true");

      const res = await fetch(`/api/feeds?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        set({ error: data.error, items: [] });
      } else {
        set({ items: data.items || [] });
      }
    } catch {
      set({ error: "Haberler alınamadı" });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleSource: async (sourceId) => {
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", sourceId }),
      });
      const data = await res.json();
      if (data.sources) set({ sources: data.sources });
    } catch {
      set({ error: "Kaynak güncellenemedi" });
    }
  },

  addSource: async (name, url) => {
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });
      const data = await res.json();
      if (data.sources) set({ sources: data.sources });
    } catch {
      set({ error: "Kaynak eklenemedi" });
    }
  },

  deleteSource: async (sourceId) => {
    try {
      const res = await fetch("/api/feeds/sources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", sourceId }),
      });
      const data = await res.json();
      if (data.sources) set({ sources: data.sources });
    } catch {
      set({ error: "Kaynak silinemedi" });
    }
  },
}));
