#!/usr/bin/env python3
"""
Wix Full Site Scraper - benizledim.com
Kategoriler, yazarlar, statik sayfalar ve yorumları çeker.
"""

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json
import time
import re
import os

BASE_URL = 'https://www.benizledim.com'
OUTPUT_DIR = 'database/data'

# Output dosyaları
CATEGORIES_FILE = f'{OUTPUT_DIR}/wix-categories.json'
TAGS_FILE = f'{OUTPUT_DIR}/wix-tags.json'
USERS_FILE = f'{OUTPUT_DIR}/wix-users.json'
PAGES_FILE = f'{OUTPUT_DIR}/wix-pages.json'
COMMENTS_FILE = f'{OUTPUT_DIR}/wix-comments.json'


def ensure_dir():
    """Output dizininin var olduğundan emin ol"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def save_json(data, filepath):
    """JSON dosyasına kaydet"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  💾 Kaydedildi: {filepath}")


def clean_html(html):
    """HTML'den gereksiz attribute'ları temizle"""
    if not html:
        return ''
    html = re.sub(r'\s*class="[^"]*"', '', html)
    html = re.sub(r'\s*style="[^"]*"', '', html)
    html = re.sub(r'\s*data-[a-z-]+="[^"]*"', '', html)
    html = re.sub(r'<span>\s*</span>', '', html)
    html = re.sub(r'<div>\s*</div>', '', html)
    return html.strip()


def scrape_categories(page):
    """Kategorileri çek"""
    print("\n📁 Kategoriler çekiliyor...")
    
    categories = []
    
    try:
        # Blog sayfasına git (kategoriler orada listelenir)
        page.goto(f'{BASE_URL}/blog', wait_until='domcontentloaded', timeout=60000)
        time.sleep(3)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        # Kategori linklerini bul
        cat_links = soup.select('a[href*="/categories/"], a[href*="/category/"]')
        
        seen = set()
        for link in cat_links:
            href = link.get('href', '')
            name = link.get_text(strip=True)
            
            if not name or name in ['Blog Yazıları', 'Blog Posts', 'Home', 'Ana Sayfa']:
                continue
            if name in seen:
                continue
            
            seen.add(name)
            
            # Tam URL oluştur
            if not href.startswith('http'):
                href = BASE_URL + href
            
            categories.append({
                'name': name,
                'slug': href.split('/')[-1].split('?')[0],
                'description': '',  # Wix'te genelde açıklama yok
                'cover_image': '',
                'url': href,
            })
        
        print(f"  ✅ {len(categories)} kategori bulundu")
        
    except Exception as e:
        print(f"  ❌ Hata: {e}")
    
    return categories


def scrape_tags(page):
    """Etiketleri çek"""
    print("\n🏷️  Etiketler çekiliyor...")
    
    tags = []
    
    try:
        # Etiketler genelde yazı sayfalarında veya /tags URL'sinde olur
        # Önce birkaç yazı sayfasından etiket toplayalım
        
        # Örnek yazıları ziyaret et
        page.goto(f'{BASE_URL}/blog', wait_until='domcontentloaded', timeout=60000)
        time.sleep(2)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        # Etiket linklerini bul
        tag_links = soup.select('a[href*="/tags/"], a[href*="/tag/"]')
        
        seen = set()
        for link in tag_links:
            name = link.get_text(strip=True)
            href = link.get('href', '')
            
            if not name or name in seen:
                continue
            
            seen.add(name)
            
            if not href.startswith('http'):
                href = BASE_URL + href
            
            tags.append({
                'name': name,
                'slug': href.split('/')[-1].split('?')[0],
                'url': href,
            })
        
        print(f"  ✅ {len(tags)} etiket bulundu")
        
    except Exception as e:
        print(f"  ❌ Hata: {e}")
    
    return tags


def scrape_user_profiles(page):
    """Yazar profillerini çek"""
    print("\n👤 Yazar profilleri çekiliyor...")
    
    users = []
    
    # Bilinen yazar URL'leri
    author_urls = [
        '/profile/nsuevci/profile',  # Su Evci
        '/profile/gurursonmez/profile',  # Gurur Sönmez
        '/profile/iriseryilmaz/profile',  # İris Eryılmaz
        '/profile/muhammedmuglu/profile',  # Muhammed Muğlu
        '/profile/alphantasar/profile',  # Alphan Karabat
        '/profile/humeyrafidan/profile',  # Hümeyra Fidan
    ]
    
    seen = set()
    
    for url_path in author_urls:
        try:
            url = f'{BASE_URL}{url_path}'
            print(f"  🔍 {url_path}...")
            
            page.goto(url, wait_until='domcontentloaded', timeout=30000)
            time.sleep(2)
            
            html = page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            # İsim
            name = ''
            name_el = soup.find('h1') or soup.find('h2')
            if name_el:
                name = name_el.get_text(strip=True)
            
            if not name or name in seen:
                continue
            
            seen.add(name)
            
            # Profil fotoğrafı
            avatar = ''
            avatar_img = soup.select_one('img[alt*="profile"], .profile-image img, [data-hook="profile-image"] img')
            if avatar_img:
                avatar = avatar_img.get('src', '')
            
            # Biyografi
            bio = ''
            bio_el = soup.select_one('[data-hook="profile-bio"], .profile-bio, [class*="about"]')
            if bio_el:
                bio = bio_el.get_text(strip=True)
            
            # Sosyal medya linkleri
            social_links = {}
            social_els = soup.select('a[href*="twitter.com"], a[href*="x.com"], a[href*="instagram.com"], a[href*="linkedin.com"]')
            for link in social_els:
                href = link.get('href', '')
                if 'twitter.com' in href or 'x.com' in href:
                    social_links['twitter'] = href
                elif 'instagram.com' in href:
                    social_links['instagram'] = href
                elif 'linkedin.com' in href:
                    social_links['linkedin'] = href
            
            users.append({
                'name': name,
                'email': get_author_email(name),
                'avatar': avatar,
                'bio': bio,
                'social_links': social_links,
                'profile_url': url,
            })
            
            print(f"    ✓ {name}")
            
        except Exception as e:
            print(f"    ❌ Hata: {e}")
    
    print(f"  ✅ {len(users)} yazar profili bulundu")
    return users


def get_author_email(name):
    """Yazar adından e-posta bul"""
    AUTHOR_EMAIL_MAP = {
        "Gurur Sönmez": "gurur@benizledim.com",
        "İris Eryılmaz": "iris@benizledim.com",
        "Muhammed Muğlu": "muhammed@benizledim.com",
        "Su Evci": "su@benizledim.com",
        "Alphan Karabat": "alphan@benizledim.com",
        "Hümeyra Fidan": "humeyra@benizledim.com",
        "Ben İzledim": "gurur@benizledim.com",
    }
    return AUTHOR_EMAIL_MAP.get(name, "gurur@benizledim.com")


def scrape_static_pages(page):
    """Statik sayfaları çek"""
    print("\n📄 Statik sayfalar çekiliyor...")
    
    pages = []
    
    # Bilinen statik sayfa URL'leri
    static_urls = [
        ('/about', 'Hakkımızda'),
        ('/contact', 'İletişim'),
        ('/team', 'Ekibimiz'),
    ]
    
    for url_path, default_title in static_urls:
        try:
            url = f'{BASE_URL}{url_path}'
            print(f"  🔍 {url_path}...")
            
            page.goto(url, wait_until='domcontentloaded', timeout=30000)
            time.sleep(2)
            
            html = page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Başlık
            title = default_title
            title_el = soup.find('h1')
            if title_el:
                title = title_el.get_text(strip=True)
            
            # İçerik
            content = ''
            content_selectors = [
                'main',
                'article',
                '[data-hook="page-content"]',
                '.page-content',
                'section',
            ]
            for selector in content_selectors:
                content_el = soup.select_one(selector)
                if content_el:
                    content = str(content_el)
                    break
            
            content = clean_html(content)
            
            if content:
                pages.append({
                    'title': title,
                    'slug': url_path.strip('/'),
                    'content': content,
                    'url': url,
                })
                print(f"    ✓ {title}")
            else:
                print(f"    ⚠️ İçerik bulunamadı: {url_path}")
            
        except Exception as e:
            print(f"    ❌ Hata ({url_path}): {e}")
    
    print(f"  ✅ {len(pages)} statik sayfa bulundu")
    return pages


def scrape_comments(page):
    """Yorumları çek"""
    print("\n💬 Yorumlar çekiliyor...")
    
    comments = []
    
    try:
        # Blog yazılarından bazılarını ziyaret edip yorumları topla
        page.goto(f'{BASE_URL}/blog', wait_until='domcontentloaded', timeout=60000)
        time.sleep(2)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        # İlk birkaç yazı linkini al
        post_links = soup.select('a[href*="/post/"]')[:5]  # İlk 5 yazı
        
        for link in post_links:
            try:
                href = link.get('href', '')
                if not href.startswith('http'):
                    href = BASE_URL + href
                
                # Sadece Türkçe yazılar
                if '/en/' in href or '/he/' in href:
                    continue
                
                print(f"  🔍 Yazıdaki yorumlar: {href.split('/')[-1][:40]}...")
                
                page.goto(href, wait_until='domcontentloaded', timeout=30000)
                time.sleep(2)
                
                html = page.content()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Yorumları bul
                comment_selectors = [
                    '[data-hook="comment"]',
                    '.comment',
                    '[class*="comment"]',
                ]
                
                for selector in comment_selectors:
                    comment_els = soup.select(selector)
                    for comment_el in comment_els:
                        author = comment_el.select_one('[class*="author"], [class*="user"]')
                        text = comment_el.select_one('[class*="text"], [class*="content"], p')
                        date = comment_el.select_one('time, [class*="date"]')
                        
                        if text:
                            comments.append({
                                'post_slug': href.split('/')[-1].split('?')[0],
                                'author': author.get_text(strip=True) if author else 'Misafir',
                                'content': text.get_text(strip=True),
                                'created_at': date.get('datetime', '') if date else '',
                            })
                
            except Exception as e:
                print(f"    ❌ Hata: {e}")
    
    except Exception as e:
        print(f"  ❌ Hata: {e}")
    
    print(f"  ✅ {len(comments)} yorum bulundu")
    return comments


def main():
    """Ana fonksiyon"""
    print("=" * 70)
    print("🚀 Wix Full Site Scraper - benizledim.com")
    print("=" * 70)
    
    ensure_dir()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(locale='tr-TR')
        
        # 1. Kategoriler
        categories = scrape_categories(page)
        save_json({
            'exported_from': 'benizledim.com (Wix)',
            'exported_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'total_categories': len(categories),
            'categories': categories,
        }, CATEGORIES_FILE)
        
        # 2. Etiketler
        tags = scrape_tags(page)
        save_json({
            'exported_from': 'benizledim.com (Wix)',
            'exported_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'total_tags': len(tags),
            'tags': tags,
        }, TAGS_FILE)
        
        # 3. Yazarlar
        users = scrape_user_profiles(page)
        save_json({
            'exported_from': 'benizledim.com (Wix)',
            'exported_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'total_users': len(users),
            'users': users,
        }, USERS_FILE)
        
        # 4. Statik Sayfalar
        pages = scrape_static_pages(page)
        save_json({
            'exported_from': 'benizledim.com (Wix)',
            'exported_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'total_pages': len(pages),
            'pages': pages,
        }, PAGES_FILE)
        
        # 5. Yorumlar
        comments = scrape_comments(page)
        save_json({
            'exported_from': 'benizledim.com (Wix)',
            'exported_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'total_comments': len(comments),
            'comments': comments,
        }, COMMENTS_FILE)
        
        browser.close()
    
    print("\n" + "=" * 70)
    print("🎉 Tüm veriler başarıyla çekildi!")
    print("=" * 70)
    print("\n📊 Özet:")
    print(f"  • Kategoriler: {len(categories)}")
    print(f"  • Etiketler: {len(tags)}")
    print(f"  • Yazarlar: {len(users)}")
    print(f"  • Statik Sayfalar: {len(pages)}")
    print(f"  • Yorumlar: {len(comments)}")
    print("\n📁 Çıktı dosyaları:")
    print(f"  • {CATEGORIES_FILE}")
    print(f"  • {TAGS_FILE}")
    print(f"  • {USERS_FILE}")
    print(f"  • {PAGES_FILE}")
    print(f"  • {COMMENTS_FILE}")
    print("=" * 70)


if __name__ == '__main__':
    main()
