"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/store/content-store";
import { getTemplatesForContentType } from "@/config/templates";
import { Palette, Loader2, Check, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface PreviewItem {
  templateId: string;
  templateName: string;
  path: string;
  width: number;
  height: number;
}

export function TemplatePreviewDialog() {
  const store = useContentStore();
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const templates = getTemplatesForContentType(store.contentType);

  const generatePreviews = async () => {
    if (!store.title.trim()) {
      toast.error("Önce bir başlık girin");
      return;
    }
    if (!store.posterUrl && !store.customImagePath) {
      toast.error("Bir film/dizi seçin veya görsel yükleyin");
      return;
    }

    setIsLoading(true);
    try {
      const data: Record<string, unknown> = {
        title: store.title,
        subtitle: store.subtitle || undefined,
        posterUrl: store.posterUrl,
        rating: store.rating ?? undefined,
        year: store.year || undefined,
        badgeText: store.badgeText || "HABER",
        bodyText: store.bodyText || undefined,
        releaseInfo: store.bodyText || undefined,
        authorName: store.authorName || undefined,
      };

      const res = await fetch("/api/generate/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: store.contentType, data }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setPreviews(result.previews || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error(`Önizleme hatası: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (templateId: string) => {
    store.setTemplateId(templateId);
    setOpen(false);
    toast.success("Şablon değiştirildi");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setOpen(true);
            if (previews.length === 0) generatePreviews();
          }}
        >
          <Palette className="h-4 w-4" />
          Alternatifleri Gör
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Tasarım Alternatifleri
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={generatePreviews}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="h-3.5 w-3.5" />
              )}
              Yenile
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Mevcut içeriğinizle tüm uygun şablonları karşılaştırın. Beğendiğinize tıklayın.
          </p>
        </DialogHeader>

        {isLoading && previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-red-700" />
            <p className="text-sm text-muted-foreground">
              Şablonlar oluşturuluyor... ({templates.length} tasarım)
            </p>
          </div>
        ) : previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Palette className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Başlık ve görsel girip &quot;Yenile&quot; butonuna tıklayın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((preview) => {
              const isSelected = store.templateId === preview.templateId;
              const templateInfo = templates.find(
                (t) => t.id === preview.templateId
              );

              return (
                <div
                  key={preview.templateId}
                  className={cn(
                    "group relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg",
                    isSelected
                      ? "border-red-700 shadow-md ring-1 ring-red-700/20"
                      : "border-transparent hover:border-red-200"
                  )}
                  onClick={() => handleSelect(preview.templateId)}
                >
                  {/* Preview Image */}
                  <div className="relative">
                    <img
                      src={`${preview.path}?t=${Date.now()}`}
                      alt={preview.templateName}
                      className="w-full aspect-square object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-red-700 px-3 py-1.5 rounded-full">
                        {isSelected ? "Seçili" : "Seç"}
                      </span>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-card">
                    <p className="font-medium text-sm truncate">
                      {preview.templateName}
                    </p>
                    {templateInfo && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {templateInfo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {preview.width}x{preview.height}
                      </Badge>
                      {isSelected && (
                        <Badge className="bg-red-700 text-[10px] px-1.5 py-0">
                          Aktif
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
