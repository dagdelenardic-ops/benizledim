import { NextRequest, NextResponse } from "next/server";
import { renderTemplate } from "@/lib/puppeteer";
import { getTemplateById } from "@/config/templates";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, data, slides } = body as {
      templateId: string;
      data: Record<string, unknown>;
      slides?: Record<string, unknown>[];
    };

    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json({ error: "Şablon bulunamadı" }, { status: 400 });
    }

    const generatedDir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(generatedDir, { recursive: true });

    const images: { path: string; filename: string; width: number; height: number }[] = [];

    if (slides && slides.length > 0) {
      for (let i = 0; i < slides.length; i++) {
        const slideData = { ...data, ...slides[i], slideNumber: i + 1, totalSlides: slides.length };
        const buffer = await renderTemplate(templateId, slideData, template.dimensions);
        const filename = `${Date.now()}-${templateId}-slide${i + 1}.jpg`;
        const filePath = path.join(generatedDir, filename);
        await fs.writeFile(filePath, buffer);
        images.push({
          path: `/generated/${filename}`,
          filename,
          width: template.dimensions.width,
          height: template.dimensions.height,
        });
      }
    } else {
      const buffer = await renderTemplate(templateId, data, template.dimensions);
      const filename = `${Date.now()}-${templateId}.jpg`;
      const filePath = path.join(generatedDir, filename);
      await fs.writeFile(filePath, buffer);
      images.push({
        path: `/generated/${filename}`,
        filename,
        width: template.dimensions.width,
        height: template.dimensions.height,
      });
    }

    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
