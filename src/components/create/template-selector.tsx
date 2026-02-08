"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getTemplatesForContentType } from "@/config/templates";
import type { ContentType } from "@/types/content";
import {
  FileImage,
  Layers,
  Smartphone,
  Image,
  BookOpen,
  Type,
  ImageIcon,
  PenLine,
  Stamp,
} from "lucide-react";
import { TemplatePreviewDialog } from "./template-preview-dialog";

interface TemplateSelectorProps {
  contentType: ContentType;
  selectedId: string;
  onSelect: (id: string) => void;
}

const templateIcons: Record<string, typeof FileImage> = {
  "haber-tek": FileImage,
  "yeni-icerik": Layers,
  "oneri": Image,
  "haber-carousel": Layers,
  "yazi-kapak": BookOpen,
  "yazi-metin": Type,
  "yazi-gorsel": ImageIcon,
  "yazi-kapanis": PenLine,
  "kapak-final": Stamp,
  "story": Smartphone,
};

export function TemplateSelector({ contentType, selectedId, onSelect }: TemplateSelectorProps) {
  const templates = getTemplatesForContentType(contentType);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Şablon Seç</Label>
        <TemplatePreviewDialog />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const Icon = templateIcons[template.id] || FileImage;
          const isSelected = selectedId === template.id;

          return (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-red-700 shadow-md"
              )}
              onClick={() => onSelect(template.id)}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    isSelected ? "bg-red-700 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
