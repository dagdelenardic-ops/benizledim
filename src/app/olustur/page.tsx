"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ContentTypeTabs } from "@/components/create/content-type-tabs";
import { ContentForm } from "@/components/create/content-form";
import { CarouselManager } from "@/components/create/carousel-manager";
import { ImagePreview } from "@/components/preview/image-preview";
import { InstagramMockup } from "@/components/preview/instagram-mockup";
import { PublishControls } from "@/components/preview/publish-controls";
import { useContentStore } from "@/store/content-store";
import { getTemplateById } from "@/config/templates";
import { Wand2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function OlusturPage() {
  const store = useContentStore();

  const handleGenerate = async () => {
    if (!store.title.trim()) {
      toast.error("Başlık gerekli");
      return;
    }

    if (!store.posterUrl && !store.customImagePath) {
      toast.error("Bir film/dizi seçin veya görsel yükleyin");
      return;
    }

    store.setIsGenerating(true);

    try {
      const data: Record<string, unknown> = {
        title: store.title,
        subtitle: store.subtitle || undefined,
        posterUrl: store.posterUrl,
        rating: store.rating ?? undefined,
        year: store.year || undefined,
        badgeText: store.badgeText || undefined,
        bodyText: store.bodyText || undefined,
        releaseInfo: store.bodyText || undefined,
        authorName: store.authorName || undefined,
      };

      const slides =
        store.contentType === "carousel" && store.slides.length > 0
          ? store.slides.map((s) => ({
              title: s.title || store.title,
              subtitle: s.subtitle,
              posterUrl: s.posterUrl || store.posterUrl,
              rating: s.rating,
              year: s.year,
            }))
          : undefined;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: store.templateId,
          data,
          slides,
        }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      store.setGeneratedImages(result.images);
      toast.success("Görsel başarıyla oluşturuldu!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error(`Görsel oluşturma hatası: ${msg}`);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const template = getTemplateById(store.templateId);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">İçerik Oluştur</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Film veya dizi haberi için görsel oluşturun.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Left: Form */}
        <div className="space-y-6">
          <ContentTypeTabs />

          <ContentForm />

          {store.contentType === "carousel" && (
            <>
              <Separator />
              <CarouselManager />
            </>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={store.isGenerating}
              className="gap-2"
              size="lg"
            >
              {store.isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {store.isGenerating ? "Oluşturuluyor..." : "Görsel Oluştur"}
            </Button>

            {store.generatedImages.length > 0 && (
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={store.isGenerating}
                className="gap-2"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Yeniden Oluştur
              </Button>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Önizleme</h2>

            {template && (
              <p className="text-xs text-muted-foreground mb-3">
                Şablon: {template.name} ({template.dimensions.width}x{template.dimensions.height})
              </p>
            )}

            {store.generatedImages.length > 0 ? (
              <InstagramMockup
                images={store.generatedImages}
                caption={store.caption}
              />
            ) : (
              <ImagePreview images={[]} />
            )}

            <div className="mt-6">
              <PublishControls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
