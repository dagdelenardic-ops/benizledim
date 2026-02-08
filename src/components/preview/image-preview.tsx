"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { GeneratedImage } from "@/types/content";

interface ImagePreviewProps {
  images: GeneratedImage[];
  className?: string;
}

export function ImagePreview({ images, className }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground",
          className
        )}
        style={{ aspectRatio: "1/1" }}
      >
        <p className="text-sm">Önizleme burada görünecek</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const isCarousel = images.length > 1;
  const aspectRatio = currentImage.height > currentImage.width ? "9/16" : "1/1";

  return (
    <div className={cn("relative", className)}>
      <div
        className="overflow-hidden rounded-lg border bg-black"
        style={{ aspectRatio }}
      >
        <img
          src={currentImage.path}
          alt={`Görsel ${currentIndex + 1}`}
          className="h-full w-full object-contain"
        />
      </div>

      {isCarousel && (
        <>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentIndex ? "w-6 bg-primary" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>

          {currentIndex > 0 && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-80"
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {currentIndex < images.length - 1 && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full opacity-80"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
