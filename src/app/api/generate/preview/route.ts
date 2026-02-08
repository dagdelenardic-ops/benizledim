import { NextRequest, NextResponse } from "next/server";
import { renderTemplate } from "@/lib/puppeteer";
import { getTemplateById, getTemplatesForContentType } from "@/config/templates";
import fs from "fs/promises";
import path from "path";
import type { ContentType } from "@/types/content";

// Generates preview images for ALL templates of a given content type
// with sample data so the user can compare designs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, data } = body as {
      contentType: ContentType;
      data: Record<string, unknown>;
    };

    const templates = getTemplatesForContentType(contentType);
    const generatedDir = path.join(process.cwd(), "public", "generated", "previews");
    await fs.mkdir(generatedDir, { recursive: true });

    const previews: { templateId: string; templateName: string; path: string; width: number; height: number }[] = [];

    for (const template of templates) {
      // Skip templates that need only specific data (like text-only slides)
      // if poster data is provided
      const templateData = {
        ...data,
        badgeText: data.badgeText || template.id.includes("oneri") ? "ÖNERİ" : "HABER",
      };

      try {
        const buffer = await renderTemplate(template.id, templateData, template.dimensions);
        const filename = `preview-${template.id}-${Date.now()}.jpg`;
        const filePath = path.join(generatedDir, filename);
        await fs.writeFile(filePath, buffer);
        previews.push({
          templateId: template.id,
          templateName: template.name,
          path: `/generated/previews/${filename}`,
          width: template.dimensions.width,
          height: template.dimensions.height,
        });
      } catch (err) {
        console.error(`Preview error for ${template.id}:`, err);
        // Skip templates that fail (e.g., missing required data)
      }
    }

    return NextResponse.json({ previews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
