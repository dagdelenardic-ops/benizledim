#!/usr/bin/env python3
import json
import os
import time
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def main():
    print("🚀 Yazar Düzeltme Botu Başlıyor...")
    urls_file = 'database/data/wix-urls.json'
    output_file = 'database/data/wix-authors.json'

    with open(urls_file, 'r', encoding='utf-8') as f:
        urls = json.load(f)

    author_map = {}
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            try:
                author_map = json.load(f)
            except:
                pass

    print(f"Toplam {len(urls)} URL incelenecek. Zaten çekilen: {len(author_map)}")

    urls_to_fetch = [u for u in urls if u not in author_map]

    if not urls_to_fetch:
        print("Tüm yazarlar zaten çekilmiş!")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        for i, url in enumerate(urls_to_fetch):
            slug = url.split('/')[-1][:50]
            print(f"[{i+1}/{len(urls_to_fetch)}] {slug}...", end=' ', flush=True)
            
            page = context.new_page()
            author_name = "Ben İzledim" # Default
            
            try:
                page.goto(url, wait_until='networkidle', timeout=15000)
                time.sleep(1)
                
                soup = BeautifulSoup(page.content(), 'html.parser')
                author_el = soup.select_one('a[href*="/profile/"]')
                if author_el:
                    author_name = author_el.get_text(strip=True)
                else:
                    author_el2 = soup.select_one('[data-hook*="author"]')
                    if author_el2:
                        author_name = author_el2.get_text(strip=True)

                print(f"✓ {author_name}")
            except Exception as e:
                print(f"❌ Hata: {str(e)[:30]}")
            finally:
                page.close()
                author_map[url] = author_name
                # Incrementally save
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(author_map, f, ensure_ascii=False, indent=2)

        browser.close()

if __name__ == '__main__':
    main()
