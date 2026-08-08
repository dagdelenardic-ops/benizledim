#!/usr/bin/env python3
"""
Bilinen Wix URL listesinden (database/data/wix-urls.json) yeniden tarama.

Eski scrape www.benizledim.com'u hedefliyordu; o domain artık yeni Laravel
sitesine gidiyor. Canlı Wix içeriği gurursonmez.wixsite.com/benizledim'de.
Bu sürücü URL'leri o tabana çevirir ve DÜZELTİLMİŞ scrape_post ile
(yazar + tarih ld+json'dan) yeniden çeker.

Çıktı: database/data/wix-posts-fixed.json
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from playwright.sync_api import sync_playwright

import scrape_wix as sw
from scraper_common import atomic_write_json, iso_utc_now

OLD_BASE = "https://www.benizledim.com"
NEW_BASE = os.getenv("WIX_LIVE_BASE", "https://gurursonmez.wixsite.com/benizledim")
URLS_INPUT = "database/data/wix-urls.json"
OUTPUT = "database/data/wix-posts-fixed.json"


def transform(url: str) -> str:
    if url.startswith(OLD_BASE):
        return NEW_BASE + url[len(OLD_BASE):]
    return url


def main() -> int:
    urls = json.load(open(URLS_INPUT))
    urls = [transform(u) for u in urls]
    print(f"Toplam {len(urls)} URL yeniden taranacak (taban: {NEW_BASE})")

    posts: list[dict] = []
    errors: list[dict] = []

    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True)
        ctx = b.new_context(locale="tr-TR")
        pg = ctx.new_page()
        pg.set_default_timeout(60000)

        for i, url in enumerate(urls, 1):
            slug = url.split("/post/")[-1][:45]
            try:
                post = sw.scrape_post(pg, url)
                if post.get("title"):
                    posts.append(post)
                    print(f"[{i}/{len(urls)}] ✓ {post['author_name'] or '?':16} | {post['published_at'][:10] or '????':10} | {post['title'][:38]}", flush=True)
                else:
                    errors.append({"url": url, "error": "missing title"})
                    print(f"[{i}/{len(urls)}] ⚠ başlık yok: {slug}", flush=True)
            except Exception as exc:  # noqa: BLE001
                errors.append({"url": url, "error": str(exc)})
                print(f"[{i}/{len(urls)}] ❌ {slug}: {exc}", flush=True)

            # her 20 postta bir ara kayıt (uzun tarama güvenliği)
            if i % 20 == 0:
                atomic_write_json(OUTPUT, {"posts": posts, "errors": errors, "partial": True})

        ctx.close()
        b.close()

    output = {
        "schema_version": "2.0",
        "script": "rescrape_from_urls.py",
        "source": NEW_BASE,
        "exported_at": iso_utc_now(),
        "total_posts": len(posts),
        "total_errors": len(errors),
        "posts": posts,
        "errors": errors,
    }
    atomic_write_json(OUTPUT, output)

    print("\n" + "=" * 50)
    print(f"Bitti: {len(posts)} yazı, {len(errors)} hata -> {OUTPUT}")
    print("\nYazar dağılımı (author_email):")
    for email, n in Counter(p["author_email"] for p in posts).most_common():
        print(f"  {n:4}  {email}")
    print("\nTarihi olan / olmayan:")
    with_date = sum(1 for p in posts if p.get("published_at"))
    print(f"  tarihli: {with_date} | tarihsiz: {len(posts) - with_date}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
