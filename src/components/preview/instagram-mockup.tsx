"use client";

import { cn } from "@/lib/utils";
import type { GeneratedImage } from "@/types/content";
import { ImagePreview } from "./image-preview";

interface InstagramMockupProps {
  images: GeneratedImage[];
  caption?: string;
  className?: string;
}

export function InstagramMockup({ images, caption, className }: InstagramMockupProps) {
  return (
    <div className={cn("w-full max-w-[380px] mx-auto", className)}>
      {/* Phone frame */}
      <div className="rounded-[2rem] border-4 border-zinc-800 bg-white shadow-xl overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-white px-4 py-2">
          <span className="text-xs font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="h-2.5 w-4 rounded-sm bg-zinc-800" />
            <div className="h-2.5 w-2.5 rounded-full border border-zinc-800" />
          </div>
        </div>

        {/* Instagram header */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[8px] font-bold">
              B
            </div>
          </div>
          <span className="text-xs font-semibold">benizledim</span>
        </div>

        {/* Image */}
        <ImagePreview images={images} />

        {/* Actions bar */}
        <div className="flex items-center gap-4 px-3 py-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>

        {/* Caption */}
        {caption && (
          <div className="px-3 pb-3">
            <p className="text-xs leading-relaxed">
              <span className="font-semibold">benizledim</span>{" "}
              {caption.length > 120 ? caption.substring(0, 120) + "..." : caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
