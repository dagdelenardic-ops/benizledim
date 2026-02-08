import RssParser from "rss-parser";
import type { FeedItem, FeedSource } from "@/types/feed";

const parser = new RssParser({
  timeout: 10000,
  headers: {
    "User-Agent": "BenIzledim/1.0",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure", { keepArray: false }],
    ],
  },
});

// In-memory cache: sourceId -> { items, fetchedAt }
const cache = new Map<string, { items: FeedItem[]; fetchedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract image URL from an RSS item
 * Tries multiple sources: enclosure, media:content, media:thumbnail, content HTML
 */
function extractImageUrl(item: Record<string, unknown>): string | null {
  // 1. enclosure with image type
  const enclosure = item.enclosure as Record<string, string> | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image/")) {
    return enclosure.url;
  }
  // enclosure without type but has url (some feeds don't set type)
  if (enclosure?.url && /\.(jpe?g|png|webp|gif)/i.test(enclosure.url)) {
    return enclosure.url;
  }

  // 2. media:content
  const mediaContent = item.mediaContent as Record<string, string> | undefined;
  if (mediaContent) {
    const url = mediaContent.$ ? (mediaContent.$ as unknown as Record<string, string>).url : mediaContent.url;
    if (url) return url;
  }

  // 3. media:thumbnail
  const mediaThumbnail = item.mediaThumbnail as Record<string, string> | undefined;
  if (mediaThumbnail) {
    const url = mediaThumbnail.$ ? (mediaThumbnail.$ as unknown as Record<string, string>).url : mediaThumbnail.url;
    if (url) return url;
  }

  // 4. Find first <img> in content or content:encoded
  const content = (item["content:encoded"] || item.content || item.summary || "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return null;
}

/**
 * Fetch and parse a single RSS feed
 */
export async function fetchFeed(source: FeedSource): Promise<FeedItem[]> {
  // Check cache
  const cached = cache.get(source.id);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.items;
  }

  try {
    const feed = await parser.parseURL(source.url);

    const items: FeedItem[] = (feed.items || []).slice(0, 20).map((item, index) => {
      const raw = item as unknown as Record<string, unknown>;
      const sourceLanguage = source.category === "en" ? "en" as const : "tr" as const;
      return {
        id: `${source.id}-${item.guid || item.link || index}`,
        title: item.title ? stripHtml(item.title) : "Başlık yok",
        description: item.content
          ? stripHtml(item.content).slice(0, 1800)
          : item.contentSnippet
            ? item.contentSnippet.slice(0, 1800)
            : "",
        link: item.link || "",
        pubDate: item.isoDate || item.pubDate || "",
        imageUrl: extractImageUrl(raw),
        sourceName: source.name,
        sourceId: source.id,
        isTranslated: false,
        sourceLanguage,
      };
    });

    // Cache the result
    cache.set(source.id, { items, fetchedAt: Date.now() });

    return items;
  } catch (error) {
    console.error(`RSS fetch error for ${source.name}:`, error);
    // Return cached items if available (stale cache)
    if (cached) return cached.items;
    return [];
  }
}

/**
 * Fetch items from multiple feed sources
 */
export async function fetchMultipleFeeds(sources: FeedSource[]): Promise<FeedItem[]> {
  const enabledSources = sources.filter((s) => s.enabled);
  const results = await Promise.allSettled(enabledSources.map((s) => fetchFeed(s)));

  const allItems: FeedItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by date (newest first)
  allItems.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return dateB - dateA;
  });

  return allItems;
}

/**
 * Clear cache for a specific source or all
 */
export function clearFeedCache(sourceId?: string) {
  if (sourceId) {
    cache.delete(sourceId);
  } else {
    cache.clear();
  }
}
