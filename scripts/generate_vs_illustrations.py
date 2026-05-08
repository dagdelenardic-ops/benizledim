#!/usr/bin/env python3
"""Generate illustrator-style art for VS (this-or-that) quiz questions."""
import json, os, time, base64, urllib.request, urllib.error

API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "quiz", "vs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

OPTION_VISUALS = {
    "q08_a": "a stylized arrow piercing through one mountain peak and pointing toward a taller second peak in the distance, golden sunrise, ambition concept, gold and crimson palette",
    "q08_b": "stylized hands clinking glasses in celebration with a confetti burst, team victory shared, warm orange and teal palette",
    "q16_a": "a tall figure standing with arms crossed inside a glass box, polite distance from authority, muted gray-blue and rust palette",
    "q16_b": "two stylized figures facing each other with a clear bold line drawn between them, direct boundary-setting, electric blue and bright red palette",
    "q21_a": "a confident craftsperson holding up a perfectly finished tool with sparks of mastery, competence concept, deep red and brass palette",
    "q21_b": "a stylized scale of justice perfectly balanced with a glowing star above, fairness concept, royal navy and pale gold palette",
}

def build_prompt(visual_desc):
    return (
        f"A flat illustrator-style vector illustration. {visual_desc}. "
        f"Style: bold modernist editorial illustration, hand-drawn quality, "
        f"limited but vibrant color palette, organic curves and geometric shapes, "
        f"slight grain texture, retro 1970s magazine aesthetic, clean composition. "
        f"No text, no words, no letters, no logos. Square 1:1 composition with full bleed."
    )

def generate(key, visual):
    out_path = os.path.join(OUTPUT_DIR, f"{key}.webp")
    if os.path.exists(out_path):
        print(f"  SKIP {key}")
        return True
    body = json.dumps({
        "model": "gpt-image-1",
        "prompt": build_prompt(visual),
        "n": 1,
        "size": "1024x1024",
        "quality": "low",
        "output_format": "webp",
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
        b64 = result["data"][0]["b64_json"]
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(b64))
        print(f"  OK   {key}")
        return True
    except urllib.error.HTTPError as e:
        err = e.read().decode()[:150] if e.fp else ""
        print(f"  FAIL {key}: {e.code} {err}")
        return False
    except Exception as e:
        print(f"  FAIL {key}: {e}")
        return False

ok = fail = 0
items = list(OPTION_VISUALS.items())
print(f"Generating {len(items)} VS illustrations")
for key, visual in items:
    print(f"[{ok+fail+1}/{len(items)}] {key}")
    if generate(key, visual):
        ok += 1
    else:
        fail += 1
    time.sleep(0.5)
print(f"\nDone: {ok} ok, {fail} failed")
