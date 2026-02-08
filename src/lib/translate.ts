// DeepSeek AI Translation - High quality, cost-effective LLM translation
// API: https://api.deepseek.com/v1/chat/completions
// Pricing: ~$0.27/1M input tokens, ~$1.10/1M output tokens (deepseek-chat)

import fs from "fs";
import path from "path";

interface CacheEntry {
  text: string;
  timestamp: number;
}

const translationCache = new Map<string, CacheEntry>();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Persistent cache file path
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translations.json");
const RETENTION_PERIOD = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Load cache from disk on startup
function loadCacheFromDisk() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      const rawCache = JSON.parse(data);
      const now = Date.now();
      let prunedCount = 0;

      Object.entries(rawCache).forEach(([key, value]) => {
        // Migration logic for old string values
        if (typeof value === 'string') {
          // Treat existing string cache as "new" to persist them
          translationCache.set(key, { text: value, timestamp: now });
        } else {
          const entry = value as CacheEntry;
          // Prune items older than 3 days
          if (now - entry.timestamp < RETENTION_PERIOD) {
            translationCache.set(key, entry);
          } else {
            prunedCount++;
          }
        }
      });
      console.log(`✓ Translation cache loaded: ${translationCache.size} entries (${prunedCount} pruned)`);
    }
  } catch (error) {
    console.warn("Translation cache load error:", error);
  }
}

// Save cache to disk
function saveCacheToDisk() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const cacheData = Object.fromEntries(translationCache.entries());
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    // console.log(`✓ Translation cache saved: ${translationCache.size} entries`);
  } catch (error) {
    console.error("Translation cache save error:", error);
  }
}

// Load cache on module initialization
loadCacheFromDisk();

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface TranslationItem {
  title: string;
  description: string;
}

/**
 * Translate multiple items in a single API call for efficiency
 */
export async function translateBatch(
  items: TranslationItem[]
): Promise<TranslationItem[]> {
  if (!DEEPSEEK_API_KEY) {
    console.warn("DEEPSEEK_API_KEY not configured, skipping translation");
    return items;
  }

  if (items.length === 0) return items;

  // Check cache first
  const uncachedIndices: number[] = [];
  const results: TranslationItem[] = [...items]; // Initialize results with original items

  items.forEach((item, index) => {
    const cacheKey = `${item.title}|${item.description}`;
    const cachedEntry = translationCache.get(cacheKey);

    if (cachedEntry) {
      const parts = cachedEntry.text.split("|RESERVED_PIPE|");
      // Handle legacy cache format (simple pipe) vs new format
      if (parts.length === 1 && cachedEntry.text.includes("|")) {
        const legacyParts = cachedEntry.text.split("|");
        results[index] = { title: legacyParts[0], description: legacyParts.slice(1).join("|") };
      } else if (parts.length === 2) {
        results[index] = { title: parts[0], description: parts[1] };
      } else {
        // Fallback/Invalid cache structure
        results[index] = { title: parts[0], description: "" };
      }
    } else {
      uncachedIndices.push(index);
    }
  });

  if (uncachedIndices.length === 0) {
    return results;
  }

  console.log(`Translating ${uncachedIndices.length} new items with DeepSeek AI...`);

  // Prepare batch translation prompt
  const uncachedItems = uncachedIndices.map((i) => items[i]);
  const batchPrompt = uncachedItems
    .map(
      (item, idx) =>
        `[${idx + 1}]\nTitle: ${item.title}\nDescription: ${item.description}\n`
    )
    .join("\n");

  const systemPrompt = `Sen profesyonel bir Türkçe çevirmensin. Film ve dizi haberlerini İngilizce'den Türkçe'ye çeviriyorsun.

Kurallar:
1. Doğal ve akıcı Türkçe kullan
2. Film jargonunu, terimleri ve isimleri koru
3. Başlıklar kısa ve çarpıcı olmalı
4. Her maddeyi aynı formatta çevir: [numara]\\nTitle: ...\\nDescription: ...
5. Sadece çeviriyi döndür, açıklama yapma`;

  const userPrompt = `Aşağıdaki film/dizi haberlerini Türkçeye çevir:\n\n${batchPrompt}`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ] as DeepSeekMessage[],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 402) {
        console.error("DeepSeek API credit exhausted");
        throw new Error("DeepSeek API kredisi bitti");
      }
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    const translatedText = data.choices[0]?.message?.content;

    if (!translatedText) {
      throw new Error("Empty response from DeepSeek");
    }

    // Parse the batch response
    const translatedItems = parseTranslationResponse(translatedText);

    // Cache and populate results
    const now = Date.now();
    uncachedIndices.forEach((originalIndex, i) => {
      if (translatedItems[i]) {
        const original = items[originalIndex];
        const translated = translatedItems[i];
        const cacheKey = `${original.title}|${original.description}`;

        // Use safer separator and store with timestamp
        translationCache.set(cacheKey, {
          text: `${translated.title}|RESERVED_PIPE|${translated.description}`,
          timestamp: now
        });

        results[originalIndex] = translated;
      } else {
        // Fallback to original if parsing failed
        results[originalIndex] = items[originalIndex];
      }
    });

    // Save cache to disk after updates
    saveCacheToDisk();

    return results;
  } catch (error) {
    console.error("DeepSeek translation error:", error);
    // Return all originals on error
    return items;
  }
}

/**
 * Parse DeepSeek's batch translation response
 */
function parseTranslationResponse(text: string): TranslationItem[] {
  const items: TranslationItem[] = [];
  const blocks = text.split(/\[\d+\]/).filter((block) => block.trim());

  blocks.forEach((block) => {
    const titleMatch = block.match(/Title:\s*(.+?)(?:\n|$)/i);
    const descMatch = block.match(/Description:\s*([\s\S]+?)(?:\n|$)/i); // [\s\S] instead of dotAll flag

    if (titleMatch && descMatch) {
      items.push({
        title: titleMatch[1].trim(),
        description: descMatch[1].trim(),
      });
    }
  });

  return items;
}

/**
 * Translate title and description together (single item)
 * Uses batch translation internally
 */
export async function translateFeedTexts(
  title: string,
  description: string
): Promise<{ title: string; description: string }> {
  const result = await translateBatch([{ title, description }]);
  return result[0] || { title, description };
}

/**
 * Legacy function for backward compatibility
 */
export async function translateToTurkish(text: string): Promise<string> {
  const result = await translateFeedTexts(text, "");
  return result.title;
}

/**
 * Clear translation cache (both memory and disk)
 */
export function clearTranslationCache() {
  translationCache.clear();
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      console.log("✓ Translation cache cleared from disk");
    }
  } catch (error) {
    console.error("Error clearing cache file:", error);
  }
}
