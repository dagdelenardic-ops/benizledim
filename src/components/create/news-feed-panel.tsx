"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";
import { useContentStore } from "@/store/content-store";
import {
  Rss,
  RefreshCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Newspaper,
  CheckCircle,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import type { FeedItem } from "@/types/feed";

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "az once";
  if (minutes < 60) return `${minutes} dk once`;
  if (hours < 24) return `${hours} saat once`;
  if (days < 7) return `${days} gun once`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function NewsFeedPanel() {
  const feedStore = useFeedStore();
  const contentStore = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Load sources and items on first open
  useEffect(() => {
    if (isOpen && feedStore.sources.length === 0) {
      feedStore.fetchSources();
    }
  }, [isOpen, feedStore.sources.length]);

  useEffect(() => {
    if (isOpen && feedStore.items.length === 0 && feedStore.sources.length > 0) {
      feedStore.fetchItems(feedStore.selectedSourceId);
    }
  }, [isOpen, feedStore.sources.length]);

  const handleRefresh = () => {
    feedStore.fetchItems(feedStore.selectedSourceId, true);
  };

  const handleSourceChange = (value: string) => {
    const sourceId = value === "all" ? null : value;
    feedStore.setSelectedSourceId(sourceId);
    feedStore.fetchItems(sourceId);
  };

  const handleSelectItem = (item: FeedItem) => {
    setSelectedItemId(item.id);

    // Reset state to clear any previous quote/content data
    contentStore.resetForNews();

    // Auto-fill form fields
    contentStore.setTitle(item.title.slice(0, 80));
    contentStore.setSubtitle(item.description.slice(0, 120));
    contentStore.setBodyText(item.description);
    contentStore.setBadgeText("HABER");

    if (item.imageUrl) {
      contentStore.setPosterUrl(item.imageUrl);
    }

    // Auto-generate caption
    const hashtags = "#benizledim #film #dizi #sinema #haber";
    const caption = `${item.title}\n\n${item.description}\n\nKaynak: ${item.sourceName}\n\n${hashtags}`;
    contentStore.setCaption(caption.slice(0, 2200));

    toast.success("Haber bilgileri forma dolduruldu!", {
      description: item.title.slice(0, 50) + "...",
    });
  };

  const enabledSources = feedStore.sources.filter((s) => s.enabled);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between gap-2",
            isOpen && "border-red-200 bg-red-50/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Rss className="h-4 w-4 text-red-700" />
            <span className="font-medium">Haber Akisi - RSS</span>
            {feedStore.items.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {feedStore.items.length} haber
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 space-y-3">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={feedStore.selectedSourceId || "all"}
            onValueChange={handleSourceChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Tum kaynaklar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum Kaynaklar ({enabledSources.length})</SelectItem>
              {enabledSources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={feedStore.isLoading}
          >
            {feedStore.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Error */}
        {feedStore.error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
            {feedStore.error}
          </p>
        )}

        {/* Loading */}
        {feedStore.isLoading && feedStore.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Haberler yukleniyor...</span>
            {enabledSources.some((s) => s.category === "en") && (
              <span className="text-xs flex items-center gap-1">
                <Languages className="h-3 w-3" />
                Yabanci haberler Turkceye cevriliyor
              </span>
            )}
          </div>
        )}

        {/* Empty state */}
        {!feedStore.isLoading && feedStore.items.length === 0 && !feedStore.error && (
          <div className="flex flex-col items-center py-8 gap-2 text-muted-foreground">
            <Newspaper className="h-6 w-6" />
            <p className="text-sm">Haber bulunamadi.</p>
            <p className="text-xs">Kaynaklari Ayarlar sayfasindan yapilandirabilisiniz.</p>
          </div>
        )}

        {/* Items list */}
        {feedStore.items.length > 0 && (
          <div className="max-h-80 overflow-y-auto rounded-lg border bg-card divide-y">
            {feedStore.items.slice(0, 30).map((item) => {
              const isSelected = selectedItemId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-accent",
                    isSelected && "bg-green-50 border-l-2 border-l-green-600"
                  )}
                >
                  {/* Thumbnail */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-16 w-16 rounded object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-muted">
                      <Newspaper className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium leading-snug line-clamp-2",
                      isSelected && "text-green-800"
                    )}>
                      {isSelected && <CheckCircle className="inline h-3.5 w-3.5 mr-1 text-green-600" />}
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    {item.isTranslated && item.originalTitle && (
                      <p className="text-[10px] text-blue-500 mt-0.5 line-clamp-1 italic">
                        EN: {item.originalTitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {item.sourceName}
                      </Badge>
                      {item.isTranslated && (
                        <Badge className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0 gap-0.5">
                          <Languages className="h-2.5 w-2.5" />
                          TR
                        </Badge>
                      )}
                      {item.pubDate && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          {timeAgo(item.pubDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* External link icon */}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-foreground p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer hint */}
        {feedStore.items.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Habere tiklayarak formu otomatik doldurun. Sonra istediginiz alanlari duzenleyebilirsiniz.
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
