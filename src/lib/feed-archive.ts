import fs from "fs";
import path from "path";

import type { FeedItem } from "@/types/feed";

type ArchivedFeedItem = FeedItem & {
  archivedAt: number; // epoch ms
};

const CACHE_DIR = path.join(process.cwd(), ".cache");
const ARCHIVE_FILE = path.join(CACHE_DIR, "feed-archive.json");

// Keep a reasonable rolling window so the file doesn't grow forever.
const RETENTION_DAYS = 14;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

let archiveLoaded = false;
const archiveByLink = new Map<string, ArchivedFeedItem>();

function safeReadJson(filePath: string): unknown | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function ensureLoaded() {
  if (archiveLoaded) return;
  archiveLoaded = true;

  const raw = safeReadJson(ARCHIVE_FILE);
  if (!raw || typeof raw !== "object") return;

  const now = Date.now();
  const items = (raw as Record<string, unknown>).items;
  if (!Array.isArray(items)) return;

  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const rec = it as Record<string, unknown>;
    const link = rec.link;
    const archivedAt = Number(rec.archivedAt);
    if (typeof link !== "string" || !link) continue;
    if (!Number.isFinite(archivedAt)) continue;
    if (now - archivedAt > RETENTION_MS) continue;
    archiveByLink.set(link, it as ArchivedFeedItem);
  }
}

function saveToDisk() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

    const now = Date.now();
    // Prune
    for (const [link, it] of archiveByLink.entries()) {
      if (now - it.archivedAt > RETENTION_MS) archiveByLink.delete(link);
    }

    const payload = {
      version: 1,
      retentionDays: RETENTION_DAYS,
      savedAt: now,
      items: Array.from(archiveByLink.values()),
    };
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(payload, null, 2));
  } catch {
    // Best-effort only. Don't break requests if disk write fails.
  }
}

export function hydrateFromArchive(items: FeedItem[]): FeedItem[] {
  ensureLoaded();
  if (archiveByLink.size === 0) return items;

  return items.map((it) => {
    const archived = it.link ? archiveByLink.get(it.link) : undefined;
    if (!archived) return it;

    // Use archived translation if present; otherwise keep current.
    if (archived.isTranslated && it.sourceLanguage === "en") {
      return {
        ...it,
        title: archived.title,
        description: archived.description,
        isTranslated: true,
        originalTitle: archived.originalTitle ?? it.title,
        originalDescription: archived.originalDescription ?? it.description,
      };
    }
    return it;
  });
}

export function upsertArchive(items: FeedItem[]) {
  ensureLoaded();
  const now = Date.now();

  for (const it of items) {
    if (!it.link) continue;

    // Archive only items with meaningful content; for EN prefer translated.
    if (it.sourceLanguage === "en" && !it.isTranslated) continue;

    archiveByLink.set(it.link, { ...(it as FeedItem), archivedAt: now });
  }

  saveToDisk();
}

export function clearFeedArchive() {
  archiveByLink.clear();
  archiveLoaded = true;
  try {
    if (fs.existsSync(ARCHIVE_FILE)) fs.rmSync(ARCHIVE_FILE);
  } catch {
    // ignore
  }
}
