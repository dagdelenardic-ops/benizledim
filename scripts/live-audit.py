#!/usr/bin/env python3
"""Canli benizledim.com TAM denetim: 223 yazi.
Yeni Show.vue donusumunu birebir taklit edip her gorselin gercekten
geldigini test eder; <img> disi kirik medyayi ve Wix kalintilarini tarar."""
import re, html, json, urllib.parse, urllib.request, concurrent.futures, collections

BASE = "https://benizledim.com"
UA = {"User-Agent": "audit/1.0"}

def get(u, t=35):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t)

# tum yazilari topla
posts, pg, last = [], 1, 1
while pg <= last:
    raw = get(f"{BASE}/yazilar?page={pg}", 40).read().decode("utf-8", "ignore")
    d = json.loads(html.unescape(re.search(r'data-page="([^"]+)"', raw).group(1)))
    pp = d["props"]["posts"]; last = pp["last_page"]; posts += pp["data"]; pg += 1
print(f"yazi: {len(posts)}")

def variant(path, w=1280):
    return f"{BASE}/img/variant?path={urllib.parse.quote(path, safe='')}&w={w}"

issues = collections.defaultdict(list)
img_total = img_ok = img_bad = 0
other_media = collections.Counter()

def img_status(url):
    try:
        r = get(url, 35)
        ct = r.headers.get("content-type", "")
        n = len(r.read())
        return r.status == 200 and ct.startswith("image") and n > 800
    except Exception:
        return False

def audit(p):
    global img_total, img_ok, img_bad
    slug = p["slug"]; body = p.get("content") or ""
    local = []
    cov = p.get("cover_image") or ""
    if cov.startswith("/storage/"):
        local.append(("cover", variant(cov, 1280)))
    elif cov:
        local.append(("cover", cov if cov.startswith("http") else BASE + cov))
    for m in re.finditer(r'<img[^>]+src=["\']?([^"\' >]+)', body, re.I):
        s = m.group(1).replace(BASE, "").split("?")[0]
        if s.startswith("/storage/"):
            local.append(("inline", variant(s, 1280)))   # fix bunu uretiyor
        elif s.startswith("http"):
            local.append(("inline", s))
        elif s:
            local.append(("inline", BASE + s))
    res = []
    for kind, u in local:
        ok = img_status(u)
        res.append(ok)
        if not ok:
            issues["broken_image"].append(f"{slug} [{kind}] {u[-70:]}")
    # <img> disi medya / kalinti
    if re.search(r'<iframe', body, re.I): other_media["iframe/embed"] += 1
    if re.search(r'<video|<source\s', body, re.I): other_media["video"] += 1
    if re.search(r'<picture', body, re.I): other_media["picture"] += 1
    if re.search(r'background-image\s*:', body, re.I): other_media["css-bg-image"] += 1
    if re.search(r'static\.wixstatic\.com|wix:image|wixstatic', body, re.I):
        other_media["wix-leftover"] += 1
        issues["wix_leftover"].append(slug)
    if re.search(r'\[\w+\]|{{|wix-[a-z]+ ', body):
        other_media["shortcode?"] += 1
    return len(res), sum(res)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    for tot, ok in ex.map(audit, posts):
        img_total += tot; img_ok += ok; img_bad += (tot - ok)

print(json.dumps({
    "posts": len(posts),
    "images_total": img_total, "images_ok": img_ok, "images_broken": img_bad,
    "posts_with_broken_image": len(set(x.split(" [")[0] for x in issues["broken_image"])),
    "other_media": dict(other_media),
}, ensure_ascii=False, indent=1))
if issues["broken_image"]:
    print("\nKIRIK GORSEL ORNEK (ilk 12):")
    for x in issues["broken_image"][:12]: print("  ", x)
if issues["wix_leftover"]:
    print("\nWIX KALINTISI olan yazilar:", issues["wix_leftover"][:10])
