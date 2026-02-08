export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: "tr" | "en" | "custom";
  enabled: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl: string | null;
  sourceName: string;
  sourceId: string;
  isTranslated: boolean;
  originalTitle?: string;
  originalDescription?: string;
  sourceLanguage: "tr" | "en";
}
