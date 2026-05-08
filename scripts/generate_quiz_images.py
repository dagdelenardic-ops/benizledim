#!/usr/bin/env python3
"""Generate stylized character portraits for the quiz using OpenAI Image API."""
import json, os, sys, time, base64, urllib.request, urllib.error

API_KEY = os.environ.get("OPENAI_API_KEY", "")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "quiz", "characters")
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(os.path.join(os.path.dirname(__file__), "..", "quiz_characters.json")) as f:
    data = json.load(f)

def build_prompt(char):
    tags = ", ".join(char.get("tags", []))
    archetype = char.get("result_archetype_tr", "")
    return (
        f"Stylized cinematic portrait illustration of a character inspired by {char['name']} from {char['work']} ({char['year']}). "
        f"Character essence: {archetype}. Traits: {tags}. "
        f"Style: bold graphic poster art, limited color palette, film noir lighting with one vibrant accent color, "
        f"strong silhouette, retro VHS grain texture, 1970s movie poster aesthetic. "
        f"No text, no logos, no watermarks. Vertical composition, dark moody atmosphere."
    )

def generate_image(char):
    out_path = os.path.join(OUTPUT_DIR, f"{char['id']}.webp")
    if os.path.exists(out_path):
        print(f"  SKIP {char['id']} (exists)")
        return True

    prompt = build_prompt(char)
    body = json.dumps({
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1536",
        "quality": "low",
        "output_format": "webp",
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
        b64 = result["data"][0]["b64_json"]
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(b64))
        print(f"  OK   {char['id']}")
        return True
    except urllib.error.HTTPError as e:
        err_body = e.read().decode() if e.fp else ""
        print(f"  FAIL {char['id']}: {e.code} {err_body[:200]}")
        return False
    except Exception as e:
        print(f"  FAIL {char['id']}: {e}")
        return False

chars = data["characters"]
start_idx = int(sys.argv[1]) if len(sys.argv) > 1 else 0
end_idx = int(sys.argv[2]) if len(sys.argv) > 2 else len(chars)

print(f"Generating images for characters {start_idx}-{end_idx-1} ({end_idx - start_idx} total)")
ok = 0
fail = 0
for i, char in enumerate(chars[start_idx:end_idx], start=start_idx):
    print(f"[{i+1}/{len(chars)}] {char['name']} ({char['work']})")
    if generate_image(char):
        ok += 1
    else:
        fail += 1
    time.sleep(0.5)

print(f"\nDone: {ok} ok, {fail} failed")
