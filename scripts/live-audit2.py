#!/usr/bin/env python3
"""Canli denetim v2 - YENI deploy edilen donusumu birebir taklit eder:
- inline <img>: variant calisiyorsa OK; degilse onerror -> Wix CDN orijinali
- background-image:/storage -> /img/variant
Bir gorsel, variant VEYA Wix-CDN-orijinali geliyorsa 'gorunur' sayilir."""
import re, html, json, urllib.parse, urllib.request, concurrent.futures, collections

BASE="https://benizledim.com"; UA={"User-Agent":"audit2/1.0"}
WIX="https://static.wixstatic.com/media/"
def get(u,t=35): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=t)
def ok(u,t=30):
    try:
        r=get(u,t); ct=r.headers.get("content-type",""); n=len(r.read())
        return r.status==200 and ct.startswith("image") and n>700
    except Exception: return False

posts,pg,last=[],1,1
while pg<=last:
    raw=get(f"{BASE}/yazilar?page={pg}",40).read().decode("utf-8","ignore")
    d=json.loads(html.unescape(re.search(r'data-page="([^"]+)"',raw).group(1)))
    pp=d["props"]["posts"]; last=pp["last_page"]; posts+=pp["data"]; pg+=1

def wixid(path):
    f=(path.split("/")[-1] or "").split("?")[0]
    return WIX+f if re.search(r'(~mv2|^[0-9a-f]{4,8}_[0-9a-f]{16,})',f,re.I) else ""

issues=[]; tot=okc=0
def variant(p,w=1280): return f"{BASE}/img/variant?path={urllib.parse.quote(p,safe='')}&w={w}"

def audit(p):
    global tot,okc
    slug=p["slug"]; body=p.get("content") or ""; loc=0; good=0
    items=[]
    cov=p.get("cover_image") or ""
    if cov.startswith("/storage/"): items.append(("cover",cov,True))
    elif cov.startswith("http"): items.append(("cover",cov,False))
    for m in re.finditer(r'<img[^>]+src=["\']?([^"\' >]+)',body,re.I):
        s=m.group(1).replace(BASE,"").split("?")[0]
        if s.startswith("/storage/"): items.append(("inline",s,True))
        elif s.startswith("http"): items.append(("inline",s,False))
    for m in re.finditer(r'background-image\s*:\s*url\(\s*[\'"]?((?:https?://(?:www\.)?benizledim\.com)?/storage/[^\'")]+)',body,re.I):
        items.append(("bg",m.group(1).replace(BASE,""),True))
    for kind,u,islocal in items:
        loc+=1
        if not islocal:
            good+=1 if (u.startswith("http") and ("youtube.com/watch" not in u)) else 0
            if "youtube.com/watch" in u: issues.append(f"{slug} [{kind}] youtube-link-as-image")
            continue
        # YENI davranis: variant OK  veya  (img ise) Wix CDN orijinali
        rendered = ok(variant(u))
        if not rendered and kind in ("inline","cover"):
            wo=wixid(u)
            if wo: rendered = ok(wo)
        if rendered: good+=1
        else: issues.append(f"{slug} [{kind}] {u[-60:]}")
    tot+=loc; okc+=good
    return

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    list(ex.map(audit,posts))

bad_posts=sorted(set(x.split(" [")[0] for x in issues))
print(json.dumps({"posts":len(posts),"media_total":tot,"renders_ok":okc,
                  "still_broken":tot-okc,"posts_affected":len(bad_posts)},
                 ensure_ascii=False,indent=1))
for x in issues[:25]: print("  ",x)
