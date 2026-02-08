import { NextRequest, NextResponse } from "next/server";
import {
  createMediaContainer,
  createCarouselChildContainer,
  createCarouselContainer,
  pollContainerUntilReady,
  publishContainer,
} from "@/lib/instagram-api";
import { uploadBufferToCloudinary } from "@/lib/image-store";
import fs from "fs/promises";
import path from "path";
import type { ContentType } from "@/types/content";

export async function POST(request: NextRequest) {
  try {
    const { images, caption, contentType } = (await request.json()) as {
      images: string[];
      caption: string;
      contentType: ContentType;
    };

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 400 });
    }

    // Upload images to Cloudinary to get public URLs
    const publicUrls: string[] = [];
    for (const imagePath of images) {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      const buffer = await fs.readFile(fullPath);
      const filename = path.basename(imagePath);
      const url = await uploadBufferToCloudinary(buffer, filename);
      publicUrls.push(url);
    }

    let postId: string;

    if (contentType === "story") {
      const container = await createMediaContainer(publicUrls[0], caption, "STORIES");
      await pollContainerUntilReady(container.id);
      const result = await publishContainer(container.id);
      postId = result.id;
    } else if (contentType === "carousel" && publicUrls.length > 1) {
      const childIds: string[] = [];
      for (const url of publicUrls) {
        const child = await createCarouselChildContainer(url);
        await pollContainerUntilReady(child.id);
        childIds.push(child.id);
      }
      const carousel = await createCarouselContainer(childIds, caption);
      await pollContainerUntilReady(carousel.id);
      const result = await publishContainer(carousel.id);
      postId = result.id;
    } else {
      const container = await createMediaContainer(publicUrls[0], caption);
      await pollContainerUntilReady(container.id);
      const result = await publishContainer(container.id);
      postId = result.id;
    }

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : `Unknown error: ${JSON.stringify(error)}`;
    console.error("Publish error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
