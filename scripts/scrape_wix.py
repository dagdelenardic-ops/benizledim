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
    "Ben İzledim": "gurur@benizledim.com",
    "BIZSSN": "gurur@benizledim.com",
    "BİZ5SN": "gurur@benizledim.com",
}


def request_delay(multiplier: float = 1.0) -> None:
    time.sleep(REQUEST_DELAY_SECONDS * multiplier)


def get_author_email(author_name: str) -> str:
    if not author_name:
        return "gurur@benizledim.com"
    return AUTHOR_EMAIL_MAP.get(author_name.strip(), "gurur@benizledim.com")


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

    # Başlık
    title = ""
    title_el = soup.find("h1")
    if title_el:
        title = title_el.get_text(strip=True)
    else:
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

    # Yazar
    author = ""
    for selector in ['a[href*="/profile/"]', '[data-hook*="author"]']:
        author_el = soup.select_one(selector)
        if author_el:
            author = author_el.get_text(strip=True)
            break

    # Kapak görseli
    cover_image = ""
    og_image = soup.find("meta", property="og:image")
    if og_image:
        cover_image = og_image.get("content", "")

    # Tarih
    published_at = ""
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
        "author_email": get_author_email(author),
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
