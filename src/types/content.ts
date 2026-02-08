export type ContentType = "single" | "carousel" | "story";

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  posterUrl?: string;
  customImagePath?: string;
  rating?: number;
  year?: string;
}

export interface ContentData {
  contentType: ContentType;
  templateId: string;
  title: string;
  subtitle?: string;
  bodyText?: string;
  posterUrl?: string;
  customImagePath?: string;
  rating?: number;
  year?: string;
  genres?: string[];
  caption: string;
  slides?: SlideData[];
}

export interface GeneratedImage {
  path: string;
  filename: string;
  width: number;
  height: number;
}

export interface PostHistoryEntry {
  id: string;
  createdAt: string;
  publishedAt?: string;
  contentType: ContentType;
  templateId: string;
  title: string;
  caption: string;
  images: GeneratedImage[];
  instagramPostId?: string;
  instagramPermalink?: string;
  status: "draft" | "generated" | "published" | "failed";
}
