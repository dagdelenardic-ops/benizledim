"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Image, Layers, Smartphone } from "lucide-react";
import type { PostHistoryEntry } from "@/types/content";

const contentTypeLabels = {
  single: { label: "Tek Görsel", icon: Image },
  carousel: { label: "Carousel", icon: Layers },
  story: { label: "Story", icon: Smartphone },
};

export default function GecmisPage() {
  const [history, setHistory] = useState<PostHistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("benizledim-history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Geçmiş</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daha önce oluşturulan ve yayınlanan içerikler.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Henüz geçmiş yok</h3>
          <p className="text-sm text-muted-foreground mt-1">
            İçerik oluşturup yayınladığınızda burada görünecek.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const ct = contentTypeLabels[entry.contentType];
            const Icon = ct.icon;

            return (
              <Card key={entry.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {entry.images[0] && (
                    <img
                      src={entry.images[0].path}
                      alt={entry.title}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Icon className="h-3 w-3" />
                        {ct.label}
                      </Badge>
                      <Badge
                        variant={entry.status === "published" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {entry.status === "published" ? "Yayında" : entry.status === "generated" ? "Oluşturuldu" : "Taslak"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(entry.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
