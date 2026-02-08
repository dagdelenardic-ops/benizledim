"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TmdbSearch } from "./tmdb-search";
import { ImageUpload } from "./image-upload";
import { TemplateSelector } from "./template-selector";
import { NewsFeedPanel } from "./news-feed-panel";
import { QuotePanel } from "./quote-panel";
import { useContentStore } from "@/store/content-store";
import { getTmdbPosterUrl, getTmdbTitle, getTmdbYear } from "@/types/tmdb";
import type { TmdbSearchResult } from "@/types/tmdb";

export function ContentForm() {
  const store = useContentStore();

  const handleTmdbSelect = (result: TmdbSearchResult) => {
    const posterUrl = getTmdbPosterUrl(result.poster_path, "w780");
    if (posterUrl) store.setPosterUrl(posterUrl);
    if (!store.title) store.setTitle(getTmdbTitle(result));
    const year = getTmdbYear(result);
    if (year) store.setYear(year);
    if (result.vote_average) store.setRating(Math.round(result.vote_average * 10) / 10);
  };

  return (
    <div className="space-y-6">
      <NewsFeedPanel />

      <QuotePanel />

      <Separator />

      <TmdbSearch onSelect={handleTmdbSelect} />

      <Separator />

      <ImageUpload
        onUpload={(path) => {
          store.setCustomImagePath(path);
          if (path) store.setPosterUrl(`${window.location.origin}${path}`);
        }}
        currentImage={store.customImagePath || undefined}
      />

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Başlık *</Label>
          <Input
            id="title"
            value={store.title}
            onChange={(e) => store.setTitle(e.target.value)}
            placeholder="Haber başlığını yazın..."
            maxLength={80}
          />
          <p className="text-xs text-muted-foreground text-right">
            {store.title.length}/80
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Alt Başlık</Label>
          <Input
            id="subtitle"
            value={store.subtitle}
            onChange={(e) => store.setSubtitle(e.target.value)}
            placeholder="Alt başlık (opsiyonel)..."
            maxLength={120}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badgeText">Etiket (sol üst badge)</Label>
          <Input
            id="badgeText"
            value={store.badgeText}
            onChange={(e) => store.setBadgeText(e.target.value)}
            placeholder="HABER, YAZI, ÖNERİ, YENİ İÇERİK vb."
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyText">Ek Metin / Makale Paragrafı</Label>
          <Textarea
            id="bodyText"
            value={store.bodyText}
            onChange={(e) => store.setBodyText(e.target.value)}
            placeholder="Yayın bilgisi, makale metni vb. HTML desteklenir: <b>kalın</b> <i>italik</i>"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authorName">Yazar Adı</Label>
          <Input
            id="authorName"
            value={store.authorName}
            onChange={(e) => store.setAuthorName(e.target.value)}
            placeholder="Hümeyra Fidan"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rating">IMDB Puanı</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={store.rating ?? ""}
              onChange={(e) =>
                store.setRating(e.target.value ? parseFloat(e.target.value) : null)
              }
              placeholder="8.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Yıl</Label>
            <Input
              id="year"
              value={store.year}
              onChange={(e) => store.setYear(e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      <Separator />

      <TemplateSelector
        contentType={store.contentType}
        selectedId={store.templateId}
        onSelect={store.setTemplateId}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="caption">Instagram Açıklaması (Caption)</Label>
        <Textarea
          id="caption"
          value={store.caption}
          onChange={(e) => store.setCaption(e.target.value)}
          placeholder="Instagram post açıklamasını yazın... #benizledim #film #dizi"
          rows={4}
          maxLength={2200}
        />
        <p className="text-xs text-muted-foreground text-right">
          {store.caption.length}/2200
        </p>
      </div>
    </div>
  );
}
