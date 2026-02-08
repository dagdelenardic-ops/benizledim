"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import { useContentStore } from "@/store/content-store";
import type { SlideData } from "@/types/content";

export function CarouselManager() {
  const slides = useContentStore((s) => s.slides);
  const addSlide = useContentStore((s) => s.addSlide);
  const removeSlide = useContentStore((s) => s.removeSlide);
  const updateSlide = useContentStore((s) => s.updateSlide);

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      title: "",
      subtitle: "",
      posterUrl: "",
    };
    addSlide(newSlide);
  };

  if (slides.length === 0) {
    return (
      <div className="space-y-3">
        <Label>Carousel Slaytları</Label>
        <p className="text-sm text-muted-foreground">
          Carousel için birden fazla slayt ekleyin. Her slayt ayrı bir görsel olacaktır.
        </p>
        <Button type="button" onClick={handleAddSlide} variant="outline" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Slayt Ekle
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Carousel Slaytları ({slides.length})</Label>
        <Button type="button" size="sm" onClick={handleAddSlide} variant="outline" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Slayt Ekle
        </Button>
      </div>

      <div className="space-y-3">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1 pt-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                    placeholder={`Slayt ${index + 1} başlığı`}
                  />
                  <Input
                    value={slide.subtitle || ""}
                    onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                    placeholder="Alt başlık (opsiyonel)"
                  />
                  <Input
                    value={slide.posterUrl || ""}
                    onChange={(e) => updateSlide(slide.id, { posterUrl: e.target.value })}
                    placeholder="Poster URL (TMDB'den otomatik veya manuel)"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeSlide(slide.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
