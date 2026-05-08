#!/usr/bin/env python3
"""Ask OpenAI to assign one iconic Unicode emoji/symbol per character."""
import json, os, urllib.request, urllib.error

API_KEY = os.environ.get("OPENAI_API_KEY", "")

with open(os.path.join(os.path.dirname(__file__), "..", "quiz_characters.json")) as f:
    data = json.load(f)

char_list = [{"id": c["id"], "name": c["name"], "work": c["work"]} for c in data["characters"]]

system = (
    "You assign ONE iconic Unicode emoji to a film/TV character based on their most "
    "recognizable visual signature, profession, weapon, or symbol. Output strict JSON: "
    "an array of {id, symbol} where symbol is a single emoji character. "
    "Use specific emojis (⚗️ for chemist, 🔍 for detective, 🐉 for dragon-rider, 👑 for queen, etc.). "
    "Avoid generic emojis like 🎬 or ⭐ — be specific to that character. "
    "Each character should ideally get a different emoji."
)
user = "Characters:\n" + json.dumps(char_list, ensure_ascii=False)

body = json.dumps({
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ],
    "response_format": {"type": "json_object"},
    "temperature": 0.4,
}).encode()

req = urllib.request.Request(
    "https://api.openai.com/v1/chat/completions",
    data=body,
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
)
with urllib.request.urlopen(req, timeout=120) as resp:
    result = json.loads(resp.read())

content = result["choices"][0]["message"]["content"]
parsed = json.loads(content)
items = parsed.get("characters") or parsed.get("data") or parsed.get("result") or list(parsed.values())[0] if parsed else []
if isinstance(items, dict) and "characters" in items:
    items = items["characters"]

# Build id -> symbol map
sym_map = {}
for it in items:
    if isinstance(it, dict) and "id" in it and "symbol" in it:
        sym_map[it["id"]] = it["symbol"]

print(f"Got {len(sym_map)} symbols")

# Merge into JSON
for c in data["characters"]:
    if c["id"] in sym_map:
        c["symbol"] = sym_map[c["id"]]

out_path = os.path.join(os.path.dirname(__file__), "..", "quiz_characters.json")
with open(out_path, "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Updated {out_path}")
for c in data["characters"][:5]:
    print(f"  {c.get('symbol', '?')} {c['name']}")
