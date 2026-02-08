"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Layers, Smartphone } from "lucide-react";
import { useContentStore } from "@/store/content-store";
import type { ContentType } from "@/types/content";

const contentTypes: { value: ContentType; label: string; icon: typeof Image }[] = [
  { value: "single", label: "Tek Görsel", icon: Image },
  { value: "carousel", label: "Carousel", icon: Layers },
  { value: "story", label: "Story", icon: Smartphone },
];

export function ContentTypeTabs() {
  const contentType = useContentStore((s) => s.contentType);
  const setContentType = useContentStore((s) => s.setContentType);
  const setTemplateId = useContentStore((s) => s.setTemplateId);

  const handleChange = (value: string) => {
    const type = value as ContentType;
    setContentType(type);
    // Set default template for the content type
    if (type === "story") {
      setTemplateId("story");
    } else if (type === "carousel") {
      setTemplateId("haber-carousel");
    } else {
      setTemplateId("haber-tek");
    }
  };

  return (
    <Tabs value={contentType} onValueChange={handleChange}>
      <TabsList className="grid w-full grid-cols-3">
        {contentTypes.map((ct) => (
          <TabsTrigger key={ct.value} value={ct.value} className="gap-1.5">
            <ct.icon className="h-4 w-4" />
            {ct.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
