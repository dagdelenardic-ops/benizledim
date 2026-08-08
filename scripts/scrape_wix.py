#!/usr/bin/env python3
"""
Wix Blog Scraper
Tüm Türkçe blog yazılarını çeker ve JSON formatında kaydeder.
"""

from __future__ import annotations

import re
import time
import os
from collections import defaultdict

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from scraper_common import atomic_write_json, env_float, env_int, iso_utc_now, safe_goto

BASE_URL = os.getenv("WIX_BASE_URL", "https://www.benizledim.com").rstrip("/")
BLOG_URL = f"{BASE_URL}/blog"
OUTPUT_DIR = "database/data"
URLS_OUTPUT = f"{OUTPUT_DIR}/wix-urls.json"
POSTS_OUTPUT = f"{OUTPUT_DIR}/wix-posts.json"
REQUEST_TIMEOUT_MS = env_int("SCRAPER_TIMEOUT_MS", 60000, minimum=10000, maximum=180000)
REQUEST_DELAY_SECONDS = env_float("SCRAPER_DELAY_SECONDS", 1.5, minimum=0.2, maximum=30.0)
SCRAPER_MAX_RETRIES = env_int("SCRAPER_MAX_RETRIES", 3, minimum=1, maximum=8)

# Yazar e-posta eşleme
AUTHOR_EMAIL_MAP = {
    "Gurur Sönmez": "gurur@benizledim.com",
    "İris Eryılmaz": "iris@benizledim.com",
    "Muhammed Muğlu": "muhammed@benizledim.com",
    "Su Evci": "su@benizledim.com",
    "Alphan Karabat": "alphan@benizledim.com",
    "Hümeyra Fidan": "humeyra@benizledim.com",
    "Gökçe Serim": "gokce@benizledim.com",
    "Ben İzledim": "gurur@benizledim.com",
    "BIZSSN": "gurur@benizledim.com",
    "BİZ5SN": "gurur@benizledim.com",
}


def request_delay(multiplier: float = 1.0) -> None:
    time.sleep(REQUEST_DELAY_SECONDS * multiplier)


def get_author_email(author_name: str, profile_url: str = "") -> str:
    """Bilinen yazarı haritadan, bilinmeyeni profil/isimden sentetik e-postaya çevir.

    ÖNEMLİ: Bilinmeyen yazarı 'gurur'a düşürmek eski migrasyonda 216 yazının
    yanlışlıkla Gurur'a atanmasına yol açtı. Artık bilinmeyen yazar için
    profil handle'ından benzersiz bir e-posta üretiyoruz.
    """
    name = (author_name or "").strip()
    if name in AUTHOR_EMAIL_MAP:
        return AUTHOR_EMAIL_MAP[name]

    # Profil URL'sinden handle çıkar: .../profile/<handle>/profile
    handle = ""
    if profile_url:
        parts = [p for p in profile_url.split("/") if p]
        if "profile" in parts:
            i = parts.index("profile")
            if i + 1 < len(parts):
                handle = parts[i + 1]

    if not handle and name:
        handle = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

    if not handle:
        # İsim de yoksa son çare Gurur (site sahibi)
        return "gurur@benizledim.com"

    return f"wix-author+{handle}@benizledim.local"


def extract_ldjson_blogposting(soup: BeautifulSoup) -> dict:
    """Sayfadaki application/ld+json BlogPosting şemasını bul (yazar/tarih için altın kaynak)."""
    import json as _json

    for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = script.string or script.get_text() or ""
        if not raw.strip():
            continue
        try:
            data = _json.loads(raw)
        except Exception:
            continue
        candidates = data if isinstance(data, list) else [data]
        # @graph desteği
        for c in list(candidates):
            if isinstance(c, dict) and isinstance(c.get("@graph"), list):
                candidates.extend(c["@graph"])
        for item in candidates:
            if isinstance(item, dict) and "BlogPosting" in str(item.get("@type", "")):
                return item
    return {}


def clean_html(html: str) -> str:
    if not html:
        return ""
    html = re.sub(r'\s*class="[^"]*"', "", html)
    html = re.sub(r'\s*style="[^"]*"', "", html)
    html = re.sub(r'\s*data-[a-z-]+="[^"]*"', "", html)
    html = re.sub(r"<span>\s*</span>", "", html)
    html = re.sub(r"<div>\s*</div>", "", html)
    html = re.sub(r"(\s*<br\s*/?>\s*){3,}", "<br><br>", html)
    return html.strip()


def collect_all_post_urls() -> list[str]:
    """Blog sayfasını Türkçe locale ile açıp infinite scroll ile tüm yazı URL'lerini topla."""
    print("🌐 Blog sayfası açılıyor (Türkçe)...")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(locale="tr-TR")
        page = context.new_page()
        page.set_default_timeout(REQUEST_TIMEOUT_MS)

        safe_goto(
            page,
            BLOG_URL,
            timeout_ms=REQUEST_TIMEOUT_MS,
            retries=SCRAPER_MAX_RETRIES,
        )
        request_delay(2)

        # Dili kontrol et - eğer İngilizce açıldıysa Türkçe'ye çevir
        try:
            lang_elements = page.query_selector_all('a[lang="tr"], [data-language="tr"]')
            if lang_elements:
                lang_elements[0].click()
                request_delay(2)
        except Exception:
            pass

        print("📜 Sayfa kaydırılıyor (infinite scroll)...")

        previous_count = 0
        no_change_count = 0
        max_no_change = 5  # 5 kez değişmezse dur

        while no_change_count < max_no_change:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            request_delay()

            links = page.query_selector_all('a[href*="/post/"]')
            current_count = len(links)

            if current_count == previous_count:
                no_change_count += 1
            else:
                no_change_count = 0
                previous_count = current_count
                print(f"  Bulunan link: {current_count}")

        urls: set[str] = set()
        links = page.query_selector_all('a[href*="/post/"]')
        for link in links:
            href = link.get_attribute("href")
            if href and "/post/" in href:
                if not href.startswith("http"):
                    href = f"{BASE_URL}{href}"
                href = href.split("?")[0]
                # İngilizce (/en/post/) ve İbranice (/he/post/) versiyonları hariç tut
                if "/en/post/" not in href and "/he/post/" not in href:
                    urls.add(href)

        context.close()
        browser.close()

        sorted_urls = sorted(urls)
        print(f"  Toplam benzersiz Türkçe URL: {len(sorted_urls)}")
        return sorted_urls


def scrape_post(page, url: str) -> dict:
    """Tek bir yazı sayfasından tüm veriyi çek."""
    safe_goto(
        page,
        url,
        timeout_ms=REQUEST_TIMEOUT_MS,
        retries=SCRAPER_MAX_RETRIES,
    )
    request_delay()

    soup = BeautifulSoup(page.content(), "html.parser")

    # ld+json BlogPosting — yazar/tarih için güvenilir kaynak
    ldjson = extract_ldjson_blogposting(soup)

    # Başlık
    title = ""
    title_el = soup.find("h1")
    if title_el:
        title = title_el.get_text(strip=True)
    if not title and ldjson.get("headline"):
        title = str(ldjson["headline"]).strip()
    if not title:
        meta_title = soup.find("meta", property="og:title")
        if meta_title:
            title = meta_title.get("content", "")

    # İçerik
    content = ""
    content_selectors = [
        '[data-hook="post-description__block"]',
        'div[data-hook="post-body"]',
        ".post-content__body",
        'div[class*="rich-content"]',
    ]

    for selector in content_selectors:
        content_el = soup.select_one(selector)
        if content_el:
            content = str(content_el)
            break

    # Eğer hiçbiri çalışmazsa article dene
    if not content:
        article = soup.find("article")
        if article:
            for tag in article.find_all(["nav", "header"]):
                tag.decompose()
            content = str(article)

    content = clean_html(content)

    # Excerpt
    excerpt = ""
    meta_desc = soup.find("meta", property="og:description")
    if meta_desc:
        excerpt = meta_desc.get("content", "")
    if not excerpt and content:
        text = BeautifulSoup(content, "html.parser").get_text()
        excerpt = text[:200].strip()

    # Yazar — öncelik: ld+json author.name, sonra DOM data-hook="user-name"
    author = ""
    author_profile_url = ""
    ld_author = ldjson.get("author")
    if isinstance(ld_author, dict):
        author = str(ld_author.get("name", "")).strip()
        author_profile_url = str(ld_author.get("url", "")).strip()
    elif isinstance(ld_author, list) and ld_author:
        first = ld_author[0]
        if isinstance(first, dict):
            author = str(first.get("name", "")).strip()
            author_profile_url = str(first.get("url", "")).strip()
        elif isinstance(first, str):
            author = first.strip()
    if not author:
        for selector in ['[data-hook="user-name"]', 'a[href*="/profile/"]', '[data-hook*="author"]']:
            author_el = soup.select_one(selector)
            if author_el:
                author = author_el.get_text(strip=True)
                if not author_profile_url and author_el.has_attr("href"):
                    author_profile_url = author_el["href"]
                break

    # Kapak görseli — öncelik: ld+json image, sonra og:image
    cover_image = ""
    ld_image = ldjson.get("image")
    if isinstance(ld_image, dict):
        cover_image = str(ld_image.get("url", "")).strip()
    elif isinstance(ld_image, list) and ld_image:
        first_img = ld_image[0]
        cover_image = (first_img.get("url", "") if isinstance(first_img, dict) else str(first_img)).strip()
    elif isinstance(ld_image, str):
        cover_image = ld_image.strip()
    if not cover_image:
        og_image = soup.find("meta", property="og:image")
        if og_image:
            cover_image = og_image.get("content", "")

    # Tarih — öncelik: ld+json datePublished, sonra meta/time
    published_at = ""
    if ldjson.get("datePublished"):
        published_at = str(ldjson["datePublished"]).strip()
    if not published_at:
        for selector in ['time[datetime]', 'meta[property="article:published_time"]']:
            element = soup.select_one(selector)
            if element:
                published_at = element.get("datetime", "") or element.get("content", "")
                break

    # Kategoriler
    categories: list[str] = []
    for cat in soup.select('a[href*="/categories/"]'):
        name = cat.get_text(strip=True)
        if name and name not in ["Blog Yazıları", "Blog Posts", "Home", "Ana Sayfa"]:
            categories.append(name)

    # Taglar
    tags: list[str] = []
    for tag in soup.select('a[href*="/tags/"]'):
        name = tag.get_text(strip=True)
        if name:
            tags.append(name)

    return {
        "title": title,
        "excerpt": excerpt,
        "content": content,
        "cover_image": cover_image,
        "author_name": author,
        "author_profile_url": author_profile_url,
        "author_email": get_author_email(author, author_profile_url),
        "categories": sorted(set(categories)),
        "tags": sorted(set(tags)),
        "published_at": published_at,
        "view_count": 0,
        "source_url": url,
    }


def main() -> int:
    print("=" * 60)
    print(f"🚀 Wix Blog Scraper ({BASE_URL})")
    print("=" * 60)

    print("\n🔍 Aşama 1: Tüm yazı URL'leri toplanıyor...")
    urls = collect_all_post_urls()
    print(f"✅ {len(urls)} Türkçe yazı URL'si bulundu\n")

    if not urls:
        print("❌ Hiç yazı bulunamadı.")
        return 1

    atomic_write_json(URLS_OUTPUT, urls)
    print(f"📋 URL listesi kaydedildi: {URLS_OUTPUT}")

    print(f"\n📝 Aşama 2: {len(urls)} yazının içeriği çekiliyor...")
    posts: list[dict] = []
    errors: list[dict] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(locale="tr-TR")
        page = context.new_page()
        page.set_default_timeout(REQUEST_TIMEOUT_MS)

        for index, url in enumerate(urls, start=1):
            slug = url.split("/post/")[-1][:50]
            print(f"  [{index}/{len(urls)}] {slug}...", end=" ")
            try:
                post = scrape_post(page, url)
                if post["title"]:
                    posts.append(post)
                    print(f"✓ {post['title'][:40]}")
                else:
                    print("⚠️ Başlık yok, atlandı")
                    errors.append({"url": url, "error": "missing title"})
            except Exception as exc:  # noqa: BLE001
                print(f"❌ {exc}")
                errors.append({"url": url, "error": str(exc)})
            request_delay()

        context.close()
        browser.close()

    posts.sort(key=lambda item: item.get("published_at", ""), reverse=True)

    output = {
        "schema_version": "1.1",
        "script": "scrape_wix.py",
        "source": BASE_URL,
        "exported_from": f"{BASE_URL} (Wix)",
        "exported_at": iso_utc_now(),
        "total_posts": len(posts),
        "total_errors": len(errors),
        "posts": posts,
        "errors": errors,
    }

    atomic_write_json(POSTS_OUTPUT, output)

    print(f"\n{'=' * 60}")
    print(f"🎉 Tamamlandı! {len(posts)} yazı kaydedildi: {POSTS_OUTPUT}")
    if errors:
        print(f"⚠️ {len(errors)} URL işlenemedi.")

    authors: dict[str, int] = defaultdict(int)
    for post in posts:
        authors[post["author_email"]] += 1

    print("\n📊 Yazar dağılımı:")
    for author, count in sorted(authors.items(), key=lambda item: -item[1]):
        print(f"  {author}: {count}")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
