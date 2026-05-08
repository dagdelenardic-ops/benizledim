#!/usr/bin/env python3
"""Generate illustrator-style art for visual-card quiz questions."""
import json, os, sys, time, base64, urllib.request, urllib.error

API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "quiz", "cards")
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(os.path.join(os.path.dirname(__file__), "..", "quiz_questions.json")) as f:
    data = json.load(f)

CARDS_INDICES = [4, 9, 13, 18, 22]

OPTION_VISUALS = {
    "q05_a": "a confident leader with arms outstretched directing a small group, geometric shapes representing organization and command, gold and deep red palette",
    "q05_b": "two hands meeting in the middle holding a delicate dove or olive branch, soft pastel sky background, mediator concept, warm peach and sage green palette",
    "q05_c": "a glowing lightbulb made of confetti and stars exploding into colorful streamers, joyful celebration, bright pink, electric blue, sunny yellow palette",
    "q05_d": "a single eye with a magnifying glass, observing from shadows, geometric grid pattern in background, deep navy and burnt orange palette",

    "q10_a": "a hand gripping a chess piece firmly atop a stylized chessboard with mountains in the distance, mastery and control concept, rich emerald and gold palette",
    "q10_b": "a glowing sacred candle on an open book with rays of light, meaningful purpose, deep indigo and warm amber palette",
    "q10_c": "an open road stretching to the horizon with a single bird flying free, freedom concept, sky blue and dusty terracotta palette",
    "q10_d": "a crowned silhouette atop a podium with stylized arrows pointing toward them, recognition and influence, regal purple and bright gold palette",

    "q14_a": "two hands locked in a firm handshake bound by a thick rope, loyalty and commitment, deep maroon and cream palette",
    "q14_b": "a glass heart held carefully in two cupped hands with light shining through it, trust concept, soft pink and silver palette",
    "q14_c": "two birds flying side by side but not touching, vast open sky, freedom in partnership, pastel teal and warm peach palette",
    "q14_d": "a heart engulfed in stylized swirling flames with abstract waves, intense emotion, fiery red and deep violet palette",

    "q19_a": "a sturdy stone pillar or anchor solidly planted in earth, dependable and grounded, earthy brown and stone gray palette",
    "q19_b": "a stylized brain with mechanical gears and constellation stars overlapping, intelligent and productive, electric blue and silver palette",
    "q19_c": "a lone wolf silhouette on a mountain peak under stars, courageous and independent, deep teal and silver moonlight palette",
    "q19_d": "a glowing soft heart with delicate flower petals floating around it, kind and understanding, blush pink and pale gold palette",

    "q23_a": "a tidy planner with checkboxes and a calm cup of tea, organized control over stress, soft sage green and warm cream palette",
    "q23_b": "two stylized speech bubbles intertwined warmly, conversation as comfort, peach and dusty rose palette",
    "q23_c": "a comedy mask with a wide grin surrounded by playful confetti, humor as relief, bright yellow and turquoise palette",
    "q23_d": "a person curled inward with starry galaxy emerging from their silhouette, deep introspection, midnight blue and cosmic purple palette",
}

def build_prompt(visual_desc):
    return (
        f"A flat illustrator-style vector illustration. {visual_desc}. "
        f"Style: bold modernist editorial illustration, hand-drawn quality, "
        f"limited but vibrant color palette, organic curves and geometric shapes, "
        f"slight grain texture, retro 1970s magazine aesthetic, clean composition. "
        f"No text, no words, no letters, no logos. Square 1:1 composition with full bleed."
    )

def generate_image(key, visual_desc):
    out_path = os.path.join(OUTPUT_DIR, f"{key}.webp")
    if os.path.exists(out_path):
        print(f"  SKIP {key}")
        return True

    body = json.dumps({
        "model": "gpt-image-1",
        "prompt": build_prompt(visual_desc),
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
print(f"Generating {len(items)} card illustrations")
for key, visual in items:
    print(f"[{ok+fail+1}/{len(items)}] {key}")
    if generate_image(key, visual):
        ok += 1
    else:
        fail += 1
    time.sleep(0.5)

print(f"\nDone: {ok} ok, {fail} failed")
