#!/usr/bin/env python3
"""
Wix Full Site Scraper
Kategoriler, etiketler, yazarlar, statik sayfalar ve yorumları çeker.
"""

from __future__ import annotations

import os
import re
import time
from typing import Any

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from scraper_common import atomic_write_json, env_float, env_int, iso_utc_now, safe_goto

BASE_URL = os.getenv("WIX_BASE_URL", "https://www.benizledim.com").rstrip("/")
OUTPUT_DIR = "database/data"
REQUEST_TIMEOUT_MS = env_int("SCRAPER_TIMEOUT_MS", 60000, minimum=10000, maximum=180000)
REQUEST_DELAY_SECONDS = env_float("SCRAPER_DELAY_SECONDS", 1.5, minimum=0.2, maximum=30.0)
SCRAPER_MAX_RETRIES = env_int("SCRAPER_MAX_RETRIES", 3, minimum=1, maximum=8)

# Output dosyaları
CATEGORIES_FILE = f"{OUTPUT_DIR}/wix-categories.json"
TAGS_FILE = f"{OUTPUT_DIR}/wix-tags.json"
USERS_FILE = f"{OUTPUT_DIR}/wix-users.json"
PAGES_FILE = f"{OUTPUT_DIR}/wix-pages.json"
COMMENTS_FILE = f"{OUTPUT_DIR}/wix-comments.json"


def request_delay(multiplier: float = 1.0) -> None:
    time.sleep(REQUEST_DELAY_SECONDS * multiplier)


def clean_html(html: str) -> str:
    if not html:
        return ""
    html = re.sub(r'\s*class="[^"]*"', "", html)
    html = re.sub(r'\s*style="[^"]*"', "", html)
    html = re.sub(r'\s*data-[a-z-]+="[^"]*"', "", html)
    html = re.sub(r"<span>\s*</span>", "", html)
    html = re.sub(r"<div>\s*</div>", "", html)
    return html.strip()


def get_author_email(name: str) -> str:
    author_email_map = {
        "Gurur Sönmez": "gurur@benizledim.com",
        "İris Eryılmaz": "iris@benizledim.com",
        "Muhammed Muğlu": "muhammed@benizledim.com",
        "Su Evci": "su@benizledim.com",
        "Alphan Karabat": "alphan@benizledim.com",
        "Hümeyra Fidan": "humeyra@benizledim.com",
        "Ben İzledim": "gurur@benizledim.com",
    }
    return author_email_map.get(name, "gurur@benizledim.com")


def save_export(filepath: str, key: str, items: list[dict], errors: list[dict]) -> None:
    payload = {
        "schema_version": "1.1",
        "script": "scrape_full_wix.py",
        "source": BASE_URL,
        "exported_from": f"{BASE_URL} (Wix)",
        "exported_at": iso_utc_now(),
        f"total_{key}": len(items),
        "total_errors": len(errors),
        key: items,
        "errors": errors,
    }
    atomic_write_json(filepath, payload)
    print(f"  💾 Kaydedildi: {filepath}")


def scrape_categories(page: Any) -> tuple[list[dict], list[dict]]:
    print("\n📁 Kategoriler çekiliyor...")
    categories: list[dict] = []
    errors: list[dict] = []

    try:
        safe_goto(page, f"{BASE_URL}/blog", timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
        request_delay()

        soup = BeautifulSoup(page.content(), "html.parser")
        cat_links = soup.select('a[href*="/categories/"], a[href*="/category/"]')

        seen: set[str] = set()
        for link in cat_links:
            href = link.get("href", "")
            name = link.get_text(strip=True)

            if not name or name in ["Blog Yazıları", "Blog Posts", "Home", "Ana Sayfa"]:
                continue
            if name in seen:
                continue
            seen.add(name)

            if not href.startswith("http"):
                href = f"{BASE_URL}{href}"

            categories.append(
                {
                    "name": name,
                    "slug": href.split("/")[-1].split("?")[0],
                    "description": "",
                    "cover_image": "",
                    "url": href,
                }
            )
    except Exception as exc:  # noqa: BLE001
        errors.append({"stage": "categories", "error": str(exc)})

    print(f"  ✅ {len(categories)} kategori bulundu")
    return categories, errors


def scrape_tags(page: Any) -> tuple[list[dict], list[dict]]:
    print("\n🏷️ Etiketler çekiliyor...")
    tags: list[dict] = []
    errors: list[dict] = []

    try:
        safe_goto(page, f"{BASE_URL}/blog", timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
        request_delay()

        soup = BeautifulSoup(page.content(), "html.parser")
        tag_links = soup.select('a[href*="/tags/"], a[href*="/tag/"]')

        seen: set[str] = set()
        for link in tag_links:
            name = link.get_text(strip=True)
            href = link.get("href", "")

            if not name or name in seen:
                continue

            seen.add(name)
            if not href.startswith("http"):
                href = f"{BASE_URL}{href}"

            tags.append({"name": name, "slug": href.split("/")[-1].split("?")[0], "url": href})
    except Exception as exc:  # noqa: BLE001
        errors.append({"stage": "tags", "error": str(exc)})

    print(f"  ✅ {len(tags)} etiket bulundu")
    return tags, errors


def scrape_user_profiles(page: Any) -> tuple[list[dict], list[dict]]:
    print("\n👤 Yazar profilleri çekiliyor...")
    users: list[dict] = []
    errors: list[dict] = []

    author_urls = [
        "/profile/nsuevci/profile",
        "/profile/gurursonmez/profile",
        "/profile/iriseryilmaz/profile",
        "/profile/muhammedmuglu/profile",
        "/profile/alphantasar/profile",
        "/profile/humeyrafidan/profile",
    ]
    seen: set[str] = set()

    for url_path in author_urls:
        try:
            url = f"{BASE_URL}{url_path}"
            print(f"  🔍 {url_path}...")
            safe_goto(page, url, timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
            request_delay()

            soup = BeautifulSoup(page.content(), "html.parser")

            name = ""
            name_el = soup.find("h1") or soup.find("h2")
            if name_el:
                name = name_el.get_text(strip=True)

            if not name or name in seen:
                continue
            seen.add(name)

            avatar = ""
            avatar_img = soup.select_one('img[alt*="profile"], .profile-image img, [data-hook="profile-image"] img')
            if avatar_img:
                avatar = avatar_img.get("src", "")

            bio = ""
            bio_el = soup.select_one('[data-hook="profile-bio"], .profile-bio, [class*="about"]')
            if bio_el:
                bio = bio_el.get_text(strip=True)

            social_links: dict[str, str] = {}
            social_els = soup.select(
                'a[href*="twitter.com"], a[href*="x.com"], a[href*="instagram.com"], a[href*="linkedin.com"]'
            )
            for link in social_els:
                href = link.get("href", "")
                if "twitter.com" in href or "x.com" in href:
                    social_links["twitter"] = href
                elif "instagram.com" in href:
                    social_links["instagram"] = href
                elif "linkedin.com" in href:
                    social_links["linkedin"] = href

            users.append(
                {
                    "name": name,
                    "email": get_author_email(name),
                    "avatar": avatar,
                    "bio": bio,
                    "social_links": social_links,
                    "profile_url": url,
                }
            )
            print(f"    ✓ {name}")
        except Exception as exc:  # noqa: BLE001
            errors.append({"stage": "users", "url": url_path, "error": str(exc)})
            print(f"    ❌ Hata: {exc}")

    print(f"  ✅ {len(users)} yazar profili bulundu")
    return users, errors


def scrape_static_pages(page: Any) -> tuple[list[dict], list[dict]]:
    print("\n📄 Statik sayfalar çekiliyor...")
    pages: list[dict] = []
    errors: list[dict] = []

    static_urls = [
        ("/about", "Hakkımızda"),
        ("/contact", "İletişim"),
        ("/team", "Ekibimiz"),
    ]

    for url_path, default_title in static_urls:
        try:
            url = f"{BASE_URL}{url_path}"
            print(f"  🔍 {url_path}...")
            safe_goto(page, url, timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
            request_delay()

            soup = BeautifulSoup(page.content(), "html.parser")
            title = default_title
            title_el = soup.find("h1")
            if title_el:
                title = title_el.get_text(strip=True)

            content = ""
            for selector in ["main", "article", '[data-hook="page-content"]', ".page-content", "section"]:
                content_el = soup.select_one(selector)
                if content_el:
                    content = str(content_el)
                    break

            content = clean_html(content)
            if content:
                pages.append({"title": title, "slug": url_path.strip("/"), "content": content, "url": url})
                print(f"    ✓ {title}")
            else:
                errors.append({"stage": "pages", "url": url_path, "error": "content not found"})
                print(f"    ⚠️ İçerik bulunamadı: {url_path}")
        except Exception as exc:  # noqa: BLE001
            errors.append({"stage": "pages", "url": url_path, "error": str(exc)})
            print(f"    ❌ Hata ({url_path}): {exc}")

    print(f"  ✅ {len(pages)} statik sayfa bulundu")
    return pages, errors


def scrape_comments(page: Any) -> tuple[list[dict], list[dict]]:
    print("\n💬 Yorumlar çekiliyor...")
    comments: list[dict] = []
    errors: list[dict] = []

    try:
        safe_goto(page, f"{BASE_URL}/blog", timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
        request_delay()
        soup = BeautifulSoup(page.content(), "html.parser")

        post_links = soup.select('a[href*="/post/"]')[:5]
        for link in post_links:
            href = link.get("href", "")
            if not href.startswith("http"):
                href = f"{BASE_URL}{href}"
            if "/en/" in href or "/he/" in href:
                continue

            try:
                print(f"  🔍 Yazıdaki yorumlar: {href.split('/')[-1][:40]}...")
                safe_goto(page, href, timeout_ms=REQUEST_TIMEOUT_MS, retries=SCRAPER_MAX_RETRIES)
                request_delay()

                post_soup = BeautifulSoup(page.content(), "html.parser")
                comment_selectors = ['[data-hook="comment"]', ".comment", '[class*="comment"]']

                for selector in comment_selectors:
                    for comment_el in post_soup.select(selector):
                        author = comment_el.select_one('[class*="author"], [class*="user"]')
                        text = comment_el.select_one('[class*="text"], [class*="content"], p')
                        date = comment_el.select_one('time, [class*="date"]')
                        if text:
                            comments.append(
                                {
                                    "post_slug": href.split("/")[-1].split("?")[0],
                                    "author": author.get_text(strip=True) if author else "Misafir",
                                    "content": text.get_text(strip=True),
                                    "created_at": date.get("datetime", "") if date else "",
                                }
                            )
            except Exception as exc:  # noqa: BLE001
                errors.append({"stage": "comments", "url": href, "error": str(exc)})
                print(f"    ❌ Hata: {exc}")
    except Exception as exc:  # noqa: BLE001
        errors.append({"stage": "comments", "error": str(exc)})
        print(f"  ❌ Hata: {exc}")

    print(f"  ✅ {len(comments)} yorum bulundu")
    return comments, errors


def main() -> int:
    print("=" * 70)
    print(f"🚀 Wix Full Site Scraper ({BASE_URL})")
    print("=" * 70)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(locale="tr-TR")
        page.set_default_timeout(REQUEST_TIMEOUT_MS)

        categories, categories_errors = scrape_categories(page)
        save_export(CATEGORIES_FILE, "categories", categories, categories_errors)

        tags, tags_errors = scrape_tags(page)
        save_export(TAGS_FILE, "tags", tags, tags_errors)

        users, users_errors = scrape_user_profiles(page)
        save_export(USERS_FILE, "users", users, users_errors)

        pages, pages_errors = scrape_static_pages(page)
        save_export(PAGES_FILE, "pages", pages, pages_errors)

        comments, comments_errors = scrape_comments(page)
        save_export(COMMENTS_FILE, "comments", comments, comments_errors)

        browser.close()

    print("\n" + "=" * 70)
    print("🎉 Tüm veriler başarıyla çekildi.")
    print("=" * 70)
    print("\n📊 Özet:")
    print(f"  • Kategoriler: {len(categories)}")
    print(f"  • Etiketler: {len(tags)}")
    print(f"  • Yazarlar: {len(users)}")
    print(f"  • Statik Sayfalar: {len(pages)}")
    print(f"  • Yorumlar: {len(comments)}")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
