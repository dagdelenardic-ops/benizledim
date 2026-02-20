from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time

url = "https://www.benizledim.com/post/2-farkli-film-tek-konu"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url, wait_until='networkidle')
    time.sleep(3)
    html = page.content()
    soup = BeautifulSoup(html, 'html.parser')
    author_el = soup.select_one('a[href*="/profile/"]')
    if author_el:
        print("Author found by /profile/:", author_el.get_text(strip=True))
    else:
        print("Author not found by /profile/")
    
    author_el2 = soup.select_one('[data-hook*="author"]')
    if author_el2:
        print("Author found by data-hook:", author_el2.get_text(strip=True))
    else:
        print("Author not found by data-hook")
    browser.close()
