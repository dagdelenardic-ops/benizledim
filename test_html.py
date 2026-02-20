import time
from playwright.sync_api import sync_playwright

url = "https://www.benizledim.com/post/20-000-ar%C4%B1-t%C3%BCr%C3%BC-20-000-especies-de-abejas-20-000-species-of-bees"
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto(url, wait_until='domcontentloaded', timeout=15000)
    except:
        pass
    time.sleep(10)
    html = page.content()
    with open("debug_html.txt", "w", encoding="utf-8") as f:
        f.write(html)
    browser.close()
