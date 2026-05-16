#!/usr/bin/env python3
"""
Ben Izledim - Wix'ten bagimsiz TAM yedek.
- Tum yazilarin tam icerigi + metadata  -> posts.json (+ okunur HTML)
- Tum govde gorselleri Wix'in kendi CDN'inden (static.wixstatic.com) ORIJINAL cozunurlukte
- Kapak gorselleri en yuksek kalitede (/img/variant w=1600)
Cikti: ~/Desktop/Benizledim-Wix-Yedek/
"""
import os, re, json, html, csv, time, urllib.parse, urllib.request, concurrent.futures, sys

BASE = "https://benizledim.com"
OUT  = os.path.expanduser("~/Desktop/Benizledim-Wix-Yedek")
WIX_CDN = "https://static.wixstatic.com/media/"
UA = {"User-Agent": "benizledim-backup/1.0"}

os.makedirs(os.path.join(OUT, "posts"), exist_ok=True)
os.makedirs(os.path.join(OUT, "images"), exist_ok=True)

def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

# 1) Tum yazilari topla (19 sayfa, data-page JSON)
posts, last_page = [], 1
pg = 1
while pg <= last_page:
    raw = get(f"{BASE}/yazilar?page={pg}", 40).decode("utf-8", "ignore")
    m = re.search(r'data-page="([^"]+)"', raw)
    d = json.loads(html.unescape(m.group(1)))
    pp = d["props"]["posts"]
    last_page = pp["last_page"]
    posts.extend(pp["data"])
    print(f"  yazi sayfasi {pg}/{last_page} -> toplam {len(posts)}", flush=True)
    pg += 1

# 2) posts.json (tam DB dump) + okunur HTML
with open(os.path.join(OUT, "posts.json"), "w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=1)

WIXID = re.compile(r'(~mv2|^[0-9a-f]{4,8}_[0-9a-f]{16,})', re.I)
img_jobs, manifest = [], []

for p in posts:
    slug = p["slug"]
    body = p.get("content") or ""
    with open(os.path.join(OUT, "posts", f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(f"<!-- {p.get('title','')} | {p.get('published_at','')} | "
                f"{(p.get('user') or {}).get('name','')} -->\n{body}")
    pdir = os.path.join(OUT, "images", slug)
    srcs = []
    cov = p.get("cover_image") or ""
    if cov:
        srcs.append(("cover", cov))
    for mm in re.finditer(r'<img[^>]+src=["\']?([^"\' >]+)', body, re.I):
        srcs.append(("inline", mm.group(1)))
    for kind, src in srcs:
        s = src.replace(f"{BASE}", "").split("?")[0]
        fname = s.split("/")[-1]
        if s.startswith("/storage/posts/content/") and WIXID.search(fname):
            # gercek Wix orijinali - Wix'in kendi CDN'inden
            url, origin = WIX_CDN + fname, "wix-cdn-original"
        elif s.startswith("/storage/"):
            # kapak vb - en yuksek kalite turetilmis
            url = f"{BASE}/img/variant?path={urllib.parse.quote(s, safe='')}&w=1600"
            origin = "site-variant-1600"
        elif src.startswith("http") and "benizledim.com" not in src:
            url, origin, fname = src, "external", (fname or "ext")
        else:
            continue
        img_jobs.append((slug, pdir, fname, url, origin))
        manifest.append({"slug": slug, "kind": kind, "file": fname,
                          "source": origin, "url": url})

print(f"  {len(posts)} yazi, {len(img_jobs)} gorsel indirilecek", flush=True)

# 3) Gorselleri indir (eszamanli, retry)
done = {"ok": 0, "skip": 0, "fail": 0}
def fetch(job):
    slug, pdir, fname, url, origin = job
    os.makedirs(pdir, exist_ok=True)
    dest = os.path.join(pdir, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        done["skip"] += 1; return
    for attempt in range(3):
        try:
            data = get(url, 45)
            if len(data) > 800:
                with open(dest, "wb") as f:
                    f.write(data)
                done["ok"] += 1
                if (done["ok"] + done["fail"]) % 100 == 0:
                    print(f"    ... {done['ok']} indi / {done['fail']} hata", flush=True)
                return
        except Exception:
            time.sleep(1.2 * (attempt + 1))
    done["fail"] += 1

with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
    list(ex.map(fetch, img_jobs))

# 4) manifest + README
with open(os.path.join(OUT, "image-manifest.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["slug", "kind", "file", "source", "url"])
    w.writeheader(); w.writerows(manifest)

total_imgs = sum(len(files) for _, _, files in os.walk(os.path.join(OUT, "images")) for _ in [0])
img_count = sum(len(fs) for _, _, fs in os.walk(os.path.join(OUT, "images")))
size_mb = sum(os.path.getsize(os.path.join(dp, fn))
              for dp, _, fns in os.walk(OUT) for fn in fns) / 1048576

with open(os.path.join(OUT, "README.txt"), "w", encoding="utf-8") as f:
    f.write(
f"""BEN IZLEDIM - WIX TAM YEDEK
Olusturma: {time.strftime('%Y-%m-%d %H:%M')}

Bu arsiv, Wix'ten BAGIMSIZ tam yedektir. Wix kapansa bile her sey burada.

icerik:
  posts.json          : {len(posts)} yazinin TAM verisi (icerik+baslik+yazar+
                         tarih+kategori+etiket+rating+SEO) - yeniden import edilebilir
  posts/<slug>.html   : her yazinin okunur govde HTML'i
  images/<slug>/...   : her yazinin gorselleri
  image-manifest.csv  : hangi gorsel hangi kaynaktan

gorsel kaynaklari:
  wix-cdn-original  : Wix'in kendi medya sunucusundan (static.wixstatic.com)
                      ORIJINAL tam cozunurluk, watermarksiz - senin yukledigin dosya
  site-variant-1600 : kapaklar, en yuksek kalite (1600px webp)
  external          : YouTube vb. dis kaynak

ozet: {len(posts)} yazi, {img_count} gorsel, ~{size_mb:.0f} MB
indirme: {done['ok']} basarili / {done['skip']} zaten vardi / {done['fail']} hata
""")

print(json.dumps({"posts": len(posts), "images_downloaded": done["ok"],
                   "skipped": done["skip"], "failed": done["fail"],
                   "out": OUT, "size_mb": round(size_mb)}, ensure_ascii=False))
