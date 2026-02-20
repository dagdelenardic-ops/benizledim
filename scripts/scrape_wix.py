#!/usr/bin/env python3
"""
Wix Blog Scraper - benizledim.com
Tüm Türkçe blog yazılarını çeker ve JSON formatında kaydeder.
"""

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json
import time
import re
import os

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


def get_author_email(author_name):
    if not author_name:
        return "gurur@benizledim.com"
    return AUTHOR_EMAIL_MAP.get(author_name.strip(), "gurur@benizledim.com")


def clean_html(html):
    if not html:
        return ''
    html = re.sub(r'\s*class="[^"]*"', '', html)
    html = re.sub(r'\s*style="[^"]*"', '', html)
    html = re.sub(r'\s*data-[a-z-]+="[^"]*"', '', html)
    html = re.sub(r'<span>\s*</span>', '', html)
    html = re.sub(r'<div>\s*</div>', '', html)
    html = re.sub(r'(\s*<br\s*/?>\s*){3,}', '<br><br>', html)
    return html.strip()


def collect_all_post_urls():
    """Blog sayfasını Türkçe locale ile açıp infinite scroll ile tüm yazı URL'lerini topla"""
    print("🌐 Blog sayfası açılıyor (Türkçe)...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Türkçe locale zorla
        context = browser.new_context(locale='tr-TR')
        page = context.new_page()

        # Blog sayfasına git
        page.goto('https://www.benizledim.com/blog', wait_until='domcontentloaded', timeout=60000)
        time.sleep(5)

        # Dili kontrol et - eğer İngilizce açıldıysa Türkçe'ye çevir
        try:
            # Wix dil değiştirici genellikle bir dropdown
            lang_elements = page.query_selector_all('a[lang="tr"], [data-language="tr"]')
            if lang_elements:
                lang_elements[0].click()
                time.sleep(3)
        except:
            pass

        print("📜 Sayfa kaydırılıyor (infinite scroll)...")

        previous_count = 0
        no_change_count = 0
        max_no_change = 5  # 5 kez değişmezse dur

        while no_change_count < max_no_change:
            # Sayfayı aşağı kaydır
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            time.sleep(2)

            # Mevcut yazı sayısını kontrol et
            links = page.query_selector_all('a[href*="/post/"]')
            current_count = len(links)

            if current_count == previous_count:
                no_change_count += 1
            else:
                no_change_count = 0
                previous_count = current_count
                print(f"  Bulunan link: {current_count}")

        # URL'leri topla - sadece Türkçe olanlar
        urls = set()
        links = page.query_selector_all('a[href*="/post/"]')
        for link in links:
            href = link.get_attribute('href')
            if href and '/post/' in href:
                if not href.startswith('http'):
                    href = 'https://www.benizledim.com' + href
                href = href.split('?')[0]
                # İngilizce (/en/post/) ve İbranice (/he/post/) versiyonları hariç tut
                if '/en/post/' not in href and '/he/post/' not in href:
                    urls.add(href)

        context.close()
        browser.close()

        print(f"  Toplam benzersiz Türkçe URL: {len(urls)}")
        return sorted(list(urls))


def scrape_post(page, url):
    """Tek bir yazı sayfasından tüm veriyi çek"""
    try:
        page.goto(url, wait_until='domcontentloaded', timeout=30000)
    except:
        page.goto(url, wait_until='commit', timeout=30000)
    time.sleep(3)

    html = page.content()
    soup = BeautifulSoup(html, 'html.parser')

    # Başlık
    title = ''
    title_el = soup.find('h1')
    if title_el:
        title = title_el.get_text(strip=True)
    else:
        meta_title = soup.find('meta', property='og:title')
        if meta_title:
            title = meta_title.get('content', '')

    # İçerik
    content = ''
    content_selectors = [
        '[data-hook="post-description__block"]',
        'div[data-hook="post-body"]',
        '.post-content__body',
        'div[class*="rich-content"]',
    ]

    for selector in content_selectors:
        content_el = soup.select_one(selector)
        if content_el:
            content = str(content_el)
            break

    # Eğer hiçbiri çalışmazsa article dene
    if not content:
        article = soup.find('article')
        if article:
            # article içinden h1'i ve nav'ı çıkar
            for tag in article.find_all(['nav', 'header']):
                tag.decompose()
            content = str(article)

    content = clean_html(content)

    # Excerpt
    excerpt = ''
    meta_desc = soup.find('meta', property='og:description')
    if meta_desc:
        excerpt = meta_desc.get('content', '')
    if not excerpt and content:
        text = BeautifulSoup(content, 'html.parser').get_text()
        excerpt = text[:200].strip()

    # Yazar
    author = ''
    for selector in ['a[href*="/profile/"]', '[data-hook*="author"]']:
        author_el = soup.select_one(selector)
        if author_el:
            author = author_el.get_text(strip=True)
            break

    # Kapak görseli
    cover_image = ''
    og_image = soup.find('meta', property='og:image')
    if og_image:
        cover_image = og_image.get('content', '')

    # Tarih
    published_at = ''
    for selector in ['time[datetime]', 'meta[property="article:published_time"]']:
        el = soup.select_one(selector)
        if el:
            published_at = el.get('datetime', '') or el.get('content', '')
            break

    # Kategoriler
    categories = []
    for cat in soup.select('a[href*="/categories/"]'):
        name = cat.get_text(strip=True)
        if name and name not in ['Blog Yazıları', 'Blog Posts', 'Home', 'Ana Sayfa']:
            categories.append(name)

    # Taglar
    tags = []
    for tag in soup.select('a[href*="/tags/"]'):
        name = tag.get_text(strip=True)
        if name:
            tags.append(name)

    return {
        'title': title,
        'excerpt': excerpt,
        'content': content,
        'cover_image': cover_image,
        'author_email': get_author_email(author),
        'categories': list(set(categories)),
        'tags': list(set(tags)),
        'published_at': published_at,
        'view_count': 0,
    }


def main():
    print("=" * 60)
    print("🚀 Wix Blog Scraper - benizledim.com (Türkçe)")
    print("=" * 60)

    # Aşama 1: URL'leri topla
    print("\n🔍 Aşama 1: Tüm yazı URL'leri toplanıyor...")
    urls = collect_all_post_urls()
    print(f"✅ {len(urls)} Türkçe yazı URL'si bulundu\n")

    if not urls:
        print("❌ Hiç yazı bulunamadı!")
        return

    # URL listesini kaydet (debug için)
    with open('database/data/wix-urls.json', 'w', encoding='utf-8') as f:
        json.dump(urls, f, ensure_ascii=False, indent=2)
    print(f"📋 URL listesi kaydedildi: database/data/wix-urls.json")

    # Aşama 2: Her yazının içeriğini çek
    print(f"\n📝 Aşama 2: {len(urls)} yazının içeriği çekiliyor...")
    posts = []
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(locale='tr-TR')
        page = context.new_page()

        for i, url in enumerate(urls):
            slug = url.split('/post/')[-1][:50]
            print(f"  [{i+1}/{len(urls)}] {slug}...", end=' ')
            try:
                post = scrape_post(page, url)
                if post['title']:
                    posts.append(post)
                    print(f"✓ {post['title'][:40]}")
                else:
                    print("⚠️ Başlık yok, atlandı")
                    errors.append(url)
            except Exception as e:
                print(f"❌ {e}")
                errors.append(url)

            time.sleep(2)

        context.close()
        browser.close()

    # Tarihe göre sırala
    posts.sort(key=lambda p: p.get('published_at', ''), reverse=True)

    # JSON kaydet
    output = {
        "exported_from": "benizledim.com (Wix)",
        "exported_at": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "total_posts": len(posts),
        "posts": posts,
    }

    os.makedirs('database/data', exist_ok=True)
    output_path = 'database/data/wix-posts.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Özet
    print(f"\n{'=' * 60}")
    print(f"🎉 Tamamlandı! {len(posts)} yazı kaydedildi: {output_path}")
    if errors:
        print(f"⚠️  {len(errors)} hatalı URL:")
        for e in errors:
            print(f"    - {e}")

    authors = {}
    for p in posts:
        a = p['author_email']
        authors[a] = authors.get(a, 0) + 1
    print("\n📊 Yazar dağılımı:")
    for a, c in sorted(authors.items(), key=lambda x: -x[1]):
        print(f"  {a}: {c}")
    print("=" * 60)


if __name__ == '__main__':
    main()
