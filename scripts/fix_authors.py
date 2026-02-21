#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import time

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from scraper_common import atomic_write_json, env_float, env_int, safe_goto

REQUEST_TIMEOUT_MS = env_int("SCRAPER_TIMEOUT_MS", 60000, minimum=10000, maximum=180000)
REQUEST_DELAY_SECONDS = env_float("SCRAPER_DELAY_SECONDS", 1.0, minimum=0.2, maximum=30.0)
SCRAPER_MAX_RETRIES = env_int("SCRAPER_MAX_RETRIES", 3, minimum=1, maximum=8)


def request_delay(multiplier: float = 1.0) -> None:
    time.sleep(REQUEST_DELAY_SECONDS * multiplier)


def load_urls(urls_file: str) -> list[str]:
    if not os.path.exists(urls_file):
        raise FileNotFoundError(f"URL listesi bulunamadı: {urls_file}")
    with open(urls_file, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("wix-urls.json bir liste olmalı.")
    return data


def load_existing_author_map(output_file: str) -> dict[str, str]:
    if not os.path.exists(output_file):
        return {}
    with open(output_file, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        return {}
    return {str(key): str(value) for key, value in data.items()}


def main() -> int:
    print("🚀 Yazar Düzeltme Botu Başlıyor...")
    urls_file = "database/data/wix-urls.json"
    output_file = "database/data/wix-authors.json"

    urls = load_urls(urls_file)
    author_map = load_existing_author_map(output_file)

    print(f"Toplam {len(urls)} URL incelenecek. Zaten çekilen: {len(author_map)}")
    urls_to_fetch = [u for u in urls if u not in author_map]

    if not urls_to_fetch:
        print("Tüm yazarlar zaten çekilmiş!")
        return 0

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context()

        for index, url in enumerate(urls_to_fetch, start=1):
            slug = url.split("/")[-1][:50]
            print(f"[{index}/{len(urls_to_fetch)}] {slug}...", end=" ", flush=True)

            page = context.new_page()
            page.set_default_timeout(REQUEST_TIMEOUT_MS)
            author_name = "Ben İzledim"

            try:
                safe_goto(
                    page,
                    url,
                    timeout_ms=REQUEST_TIMEOUT_MS,
                    retries=SCRAPER_MAX_RETRIES,
                    wait_until="networkidle",
                )
                request_delay()

                soup = BeautifulSoup(page.content(), "html.parser")
                author_el = soup.select_one('a[href*="/profile/"]')
                if author_el:
                    author_name = author_el.get_text(strip=True)
                else:
                    author_el2 = soup.select_one('[data-hook*="author"]')
                    if author_el2:
                        author_name = author_el2.get_text(strip=True)

                print(f"✓ {author_name}")
            except Exception as exc:  # noqa: BLE001
                print(f"❌ Hata: {str(exc)[:60]}")
            finally:
                page.close()
                author_map[url] = author_name
                atomic_write_json(output_file, author_map)
                request_delay(0.3)

        browser.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
