import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_FEEDS } from "@/config/default-feeds";
import type { FeedSource } from "@/types/feed";

const DATA_FILE = path.join(process.cwd(), "data", "feeds.json");

/**
 * Read feed sources from file, fallback to defaults
 */
function readSources(): FeedSource[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw) as FeedSource[];
    }
  } catch {
    // If file is corrupted, return defaults
  }
  return [...DEFAULT_FEEDS];
}

/**
 * Write feed sources to file
 */
function writeSources(sources: FeedSource[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(sources, null, 2), "utf-8");
}

/**
 * Get all sources (exported for use by feeds route)
 */
export function getActiveSources(): FeedSource[] {
  return readSources();
}

// GET /api/feeds/sources - List all feed sources
export async function GET() {
  const sources = readSources();
  return NextResponse.json({ sources });
}

// POST /api/feeds/sources - Add new source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url } = body as { name: string; url: string };

    if (!name || !url) {
      return NextResponse.json({ error: "İsim ve URL gerekli" }, { status: 400 });
    }

    const sources = readSources();
    const id = `custom-${Date.now()}`;
    const newSource: FeedSource = {
      id,
      name,
      url,
      category: "custom",
      enabled: true,
    };

    sources.push(newSource);
    writeSources(sources);

    return NextResponse.json({ source: newSource, sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kaynak eklenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/feeds/sources - Update sources (toggle enabled, delete, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sourceId, sources: newSources } = body as {
      action: "toggle" | "delete" | "replace-all";
      sourceId?: string;
      sources?: FeedSource[];
    };

    let sources = readSources();

    switch (action) {
      case "toggle": {
        if (!sourceId) return NextResponse.json({ error: "sourceId gerekli" }, { status: 400 });
        sources = sources.map((s) =>
          s.id === sourceId ? { ...s, enabled: !s.enabled } : s
        );
        break;
      }
      case "delete": {
        if (!sourceId) return NextResponse.json({ error: "sourceId gerekli" }, { status: 400 });
        sources = sources.filter((s) => s.id !== sourceId);
        break;
      }
      case "replace-all": {
        if (!newSources) return NextResponse.json({ error: "sources gerekli" }, { status: 400 });
        sources = newSources;
        break;
      }
      default:
        return NextResponse.json({ error: "Geçersiz aksiyon" }, { status: 400 });
    }

    writeSources(sources);
    return NextResponse.json({ sources });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kaynak güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
