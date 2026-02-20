from playwright.sync_api import sync_playwright
import time
url = "https://www.benizledim.com/post/20-000-arı-türü-20-000-especies-de-abejas-20-000-species-of-bees"
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url, wait_until='networkidle')
    time.sleep(3)
    print("Page Title:", page.title())
    for el in page.query_selector_all('a[href*="/profile/"]'):
        print("Profile link:", el.inner_text())
    for el in page.query_selector_all('[data-hook*="author"]'):
        print("Author link:", el.inner_text())
    browser.close()
