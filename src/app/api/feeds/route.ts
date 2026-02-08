import { NextRequest, NextResponse } from "next/server";
import { fetchFeed, fetchMultipleFeeds, clearFeedCache } from "@/lib/rss-parser";
import { translateBatch, clearTranslationCache } from "@/lib/translate";
import { clearFeedArchive, hydrateFromArchive, upsertArchive } from "@/lib/feed-archive";
import { getActiveSources } from "./sources/route";
import type { FeedItem } from "@/types/feed";

/**
 * Translate English feed items to Turkish using DeepSeek batch translation.
 * Much faster and more efficient than individual translations.
 */
async function translateItems(items: FeedItem[]): Promise<FeedItem[]> {
  const BATCH_SIZE = 10; // Process 10 items at once with DeepSeek batch API

  // Filter only English items that need translation
  const needsTranslation = items.filter(
    (item) => item.sourceLanguage === "en" && !item.isTranslated
  );

  if (needsTranslation.length === 0) {
    return items;
  }

  console.log(`Starting batch translation of ${needsTranslation.length} English items...`);

  const translatedBatches: FeedItem[] = [];

  // Process in batches
  for (let i = 0; i < needsTranslation.length; i += BATCH_SIZE) {
    const batch = needsTranslation.slice(i, i + BATCH_SIZE);
    console.log(
      `Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needsTranslation.length / BATCH_SIZE)} (${batch.length} items)...`
    );

    try {
      // Prepare batch for translation
      const translationInput = batch.map((item) => ({
        title: item.title,
        description: item.description,
      }));

      // Translate batch
      const translated = await translateBatch(translationInput);

      // Map back to FeedItems
      const translatedItems = batch.map((item, idx) => ({
        ...item,
        title: translated[idx]?.title || item.title,
        description: translated[idx]?.description || item.description,
        originalTitle: item.title,
        originalDescription: item.description,
        isTranslated: true,
      }));

      translatedBatches.push(...translatedItems);
    } catch (error) {
      console.error(`Batch translation error:`, error);
      // Keep originals on error
      translatedBatches.push(...batch);
    }
  }

  // Merge translated items back with non-English items
  const translatedMap = new Map(
    translatedBatches.map((item) => [item.link, item])
  );

  const result = items.map((item) => {
    if (item.sourceLanguage === "en" && !item.isTranslated) {
      return translatedMap.get(item.link) || item;
    }
    return item;
  });

  const translatedCount = result.filter((item) => item.isTranslated).length;
  console.log(`✓ Translation complete: ${translatedCount}/${items.length} items translated`);

  return result;
}

// GET /api/feeds - Fetch RSS feed items
// Optional query: ?sourceId=xxx to filter by source
// Optional query: ?refresh=true to clear cache first
// Optional query: ?translate=false to skip translation
// Optional query: ?clearTranslations=true to clear translation cache + archive
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get("sourceId");
    const refresh = searchParams.get("refresh") === "true";
    const shouldTranslate = searchParams.get("translate") !== "false";
    const clearTranslations = searchParams.get("clearTranslations") === "true";

    const sources = getActiveSources();

    if (refresh) {
      clearFeedCache(sourceId || undefined);
      // Important: do NOT clear translation cache on refresh.
      // Refresh should re-fetch RSS, but reuse local translation archives to avoid re-paying for the same work.
    }

    if (clearTranslations) {
      clearTranslationCache();
      clearFeedArchive();
    }

    let items: FeedItem[];
    if (sourceId) {
      const source = sources.find((s) => s.id === sourceId);
      if (!source) {
        return NextResponse.json({ error: "Kaynak bulunamadı" }, { status: 404 });
      }
      items = await fetchFeed(source);
    } else {
      items = await fetchMultipleFeeds(sources);
    }

    // Apply local archive before translating, so already-translated links won't be re-translated.
    items = hydrateFromArchive(items);

    // Translate English items to Turkish
    if (shouldTranslate) {
      items = await translateItems(items);
    }

    // Persist translated items for next runs.
    upsertArchive(items);

    return NextResponse.json({
      items,
      sourceCount: sources.filter((s) => s.enabled).length,
      totalItems: items.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "RSS haberleri alınamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
