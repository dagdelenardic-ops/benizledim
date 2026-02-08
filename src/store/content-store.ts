import { create } from "zustand";
import type { ContentType, ContentData, GeneratedImage, SlideData } from "@/types/content";

interface ContentStore {
  contentType: ContentType;
  templateId: string;
  title: string;
  subtitle: string;
  bodyText: string;
  badgeText: string;
  authorName: string;
  posterUrl: string;
  customImagePath: string;
  rating: number | null;
  year: string;
  genres: string[];
  caption: string;
  slides: SlideData[];
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  isPublishing: boolean;

  setContentType: (type: ContentType) => void;
  setTemplateId: (id: string) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setBodyText: (text: string) => void;
  setBadgeText: (text: string) => void;
  setAuthorName: (name: string) => void;
  setPosterUrl: (url: string) => void;
  setCustomImagePath: (path: string) => void;
  setRating: (rating: number | null) => void;
  setYear: (year: string) => void;
  setGenres: (genres: string[]) => void;
  setCaption: (caption: string) => void;
  setSlides: (slides: SlideData[]) => void;
  addSlide: (slide: SlideData) => void;
  removeSlide: (id: string) => void;
  updateSlide: (id: string, data: Partial<SlideData>) => void;
  setGeneratedImages: (images: GeneratedImage[]) => void;
  setIsGenerating: (v: boolean) => void;
  setIsPublishing: (v: boolean) => void;
  reset: () => void;
  resetForQuote: () => void;
  resetForNews: () => void;
  getContentData: () => ContentData;
}

const initialState = {
  contentType: "single" as ContentType,
  templateId: "haber-tek",
  title: "",
  subtitle: "",
  bodyText: "",
  badgeText: "",
  authorName: "",
  posterUrl: "",
  customImagePath: "",
  rating: null as number | null,
  year: "",
  genres: [] as string[],
  caption: "",
  slides: [] as SlideData[],
  generatedImages: [] as GeneratedImage[],
  isGenerating: false,
  isPublishing: false,
};

export const useContentStore = create<ContentStore>((set, get) => ({
  ...initialState,

  setContentType: (contentType) => set({ contentType }),
  setTemplateId: (templateId) => set({ templateId }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setBodyText: (bodyText) => set({ bodyText }),
  setBadgeText: (badgeText) => set({ badgeText }),
  setAuthorName: (authorName) => set({ authorName }),
  setPosterUrl: (posterUrl) => set({ posterUrl }),
  setCustomImagePath: (customImagePath) => set({ customImagePath }),
  setRating: (rating) => set({ rating }),
  setYear: (year) => set({ year }),
  setGenres: (genres) => set({ genres }),
  setCaption: (caption) => set({ caption }),
  setSlides: (slides) => set({ slides }),
  addSlide: (slide) => set((s) => ({ slides: [...s.slides, slide] })),
  removeSlide: (id) => set((s) => ({ slides: s.slides.filter((sl) => sl.id !== id) })),
  updateSlide: (id, data) =>
    set((s) => ({
      slides: s.slides.map((sl) => (sl.id === id ? { ...sl, ...data } : sl)),
    })),
  setGeneratedImages: (generatedImages) => set({ generatedImages }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsPublishing: (isPublishing) => set({ isPublishing }),
  reset: () => set(initialState),

  // Reset state for quote content (clear news-specific data)
  resetForQuote: () => set({
    templateId: "replik",
    title: "",
    subtitle: "",
    bodyText: "",
    badgeText: "REPLİK",
    authorName: "",
    posterUrl: "",
    customImagePath: "",
    rating: null,
    year: "",
    genres: [],
    caption: "",
    slides: [],
    // Keep generatedImages to show previous work
  }),

  // Reset state for news content (clear quote-specific data)
  resetForNews: () => set({
    templateId: "haber-tek",
    title: "",
    subtitle: "",
    bodyText: "",
    badgeText: "HABER",
    authorName: "",
    posterUrl: "",
    customImagePath: "",
    rating: null,
    year: "",
    genres: [],
    caption: "",
    slides: [],
    // Keep generatedImages to show previous work
  }),

  getContentData: () => {
    const s = get();
    return {
      contentType: s.contentType,
      templateId: s.templateId,
      title: s.title,
      subtitle: s.subtitle || undefined,
      bodyText: s.bodyText || undefined,
      posterUrl: s.posterUrl || undefined,
      customImagePath: s.customImagePath || undefined,
      rating: s.rating ?? undefined,
      year: s.year || undefined,
      genres: s.genres.length > 0 ? s.genres : undefined,
      caption: s.caption,
      slides: s.slides.length > 0 ? s.slides : undefined,
    };
  },
}));
