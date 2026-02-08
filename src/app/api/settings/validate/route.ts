import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { service } = (await request.json()) as { service: string };

  const results: Record<string, { ok: boolean; message: string; data?: Record<string, unknown> }> = {};

  if (service === "tmdb" || service === "all") {
    const token = process.env.TMDB_ACCESS_TOKEN;
    if (!token) {
      results.tmdb = { ok: false, message: "TMDB_ACCESS_TOKEN ayarlanmamış" };
    } else {
      try {
        const res = await fetch("https://api.themoviedb.org/3/movie/550?language=tr-TR", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          results.tmdb = { ok: true, message: `Bağlı (test: ${data.title})` };
        } else {
          results.tmdb = { ok: false, message: `Hata: ${res.status} - Token geçersiz olabilir` };
        }
      } catch {
        results.tmdb = { ok: false, message: "TMDB API'ye bağlanılamadı" };
      }
    }
  }

  if (service === "instagram" || service === "all") {
    const userId = process.env.INSTAGRAM_USER_ID;
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!userId || !token) {
      results.instagram = {
        ok: false,
        message: !userId && !token
          ? "INSTAGRAM_USER_ID ve INSTAGRAM_ACCESS_TOKEN ayarlanmamış"
          : !userId
          ? "INSTAGRAM_USER_ID ayarlanmamış"
          : "INSTAGRAM_ACCESS_TOKEN ayarlanmamış",
      };
    } else {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v21.0/${userId}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${token}`
        );
        if (res.ok) {
          const data = await res.json();
          results.instagram = {
            ok: true,
            message: `@${data.username} bağlı`,
            data: {
              username: data.username,
              name: data.name,
              profilePicture: data.profile_picture_url,
              followers: data.followers_count,
              mediaCount: data.media_count,
            },
          };
        } else {
          const err = await res.json().catch(() => ({}));
          const errMsg = (err as Record<string, Record<string, string>>)?.error?.message || `HTTP ${res.status}`;
          results.instagram = { ok: false, message: `Hata: ${errMsg}` };
        }
      } catch {
        results.instagram = { ok: false, message: "Instagram API'ye bağlanılamadı" };
      }
    }
  }

  if (service === "cloudinary" || service === "all") {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && "CLOUDINARY_CLOUD_NAME",
        !apiKey && "CLOUDINARY_API_KEY",
        !apiSecret && "CLOUDINARY_API_SECRET",
      ].filter(Boolean);
      results.cloudinary = { ok: false, message: `Eksik: ${missing.join(", ")}` };
    } else {
      try {
        const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
          headers: { Authorization: `Basic ${authHeader}` },
        });
        if (res.ok) {
          results.cloudinary = { ok: true, message: `${cloudName} bağlı` };
        } else {
          results.cloudinary = { ok: false, message: `Hata: ${res.status} - Kimlik bilgileri geçersiz` };
        }
      } catch {
        results.cloudinary = { ok: false, message: "Cloudinary API'ye bağlanılamadı" };
      }
    }
  }

  return NextResponse.json(results);
}
