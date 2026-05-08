#!/usr/bin/env python3
"""Generate deep character analysis fields via OpenAI (Turkish, editorial tone)."""
import json, os, urllib.request, time

API_KEY = os.environ.get("OPENAI_API_KEY", "")

with open(os.path.join(os.path.dirname(__file__), "..", "quiz_characters.json")) as f:
    data = json.load(f)

system = (
    "Sen sinema/televizyon karakterleri üzerine derin tahlil yazan bir Türk eleştirmensin. "
    "Editöryel ton: ne BuzzFeed kadar yüzeyde ne akademik kadar mesafeli — Le Monde / The Atlantic / Birgün gazete tarzı. "
    "Her karakter için ŞU JSON ALANLARINI Türkçe doldur:\n"
    "- famous_quote_tr: Karakterin ikonik tek cümlelik repliği (yoksa ona uyan deyim, max 12 kelime, tırnak işareti olmadan)\n"
    "- depth_tr: Karakterin psikolojik derinliği — bu kişinin neden böyle olduğunun KÖKÜ (2-3 cümle)\n"
    "- shadow_tr: Karakterin görmediği veya kabul etmediği karanlık yanı (1-2 cümle)\n"
    "- challenge_tr: Bu karakter hayatta neyle en çok zorlanıyor (1-2 cümle)\n"
    "- as_friend_tr: Bu karakter arkadaşın olsaydı nasıl bir arkadaş olurdu (1-2 cümle)\n"
    "- as_partner_tr: Bu karakter partner olsaydı ilişkide nasıl olurdu, riskleri ne (1-2 cümle)\n"
    "- career_dna_tr: Bu karakter günümüzde olsa hangi meslekte parlardı, neden (1-2 cümle)\n"
    "- growth_arc_tr: Bu karakterin tamamlaması gereken iç yolculuk nedir (1-2 cümle)\n"
    "- if_you_are_tr: 'Sen bir X'sen…' diye başlayan, kullanıcıya seslenen, karakterle özdeşleşen 2-3 cümlelik kişiselleştirilmiş tahlil\n"
    "Genel kural: klişeden uzak, somut, edebi. 'Çok güçlüsün/duygusalsın' GİBİ konuşma. Tırnak işareti, # sembol kullanma. Türkçe noktalama düzgün."
)

results = {}
batch_size = 6
chars = data["characters"]
print(f"Generating analysis for {len(chars)} characters in batches of {batch_size}...")

for batch_start in range(0, len(chars), batch_size):
    batch = chars[batch_start:batch_start + batch_size]
    user = "Karakterler:\n" + json.dumps([
        {"id": c["id"], "name": c["name"], "work": c["work"], "year": c["year"],
         "archetype": c["result_archetype_tr"], "traits": c["traits"]}
        for c in batch
    ], ensure_ascii=False)

    body = json.dumps({
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user + "\n\nHer karakter için ALANLARI doldur. Çıktı formatı: {\"items\":[{id, famous_quote_tr, depth_tr, shadow_tr, challenge_tr, as_friend_tr, as_partner_tr, career_dna_tr, growth_arc_tr, if_you_are_tr}]}"},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.7,
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            result = json.loads(resp.read())
        content = result["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        items = parsed.get("items", [])
        for it in items:
            if isinstance(it, dict) and "id" in it:
                results[it["id"]] = it
        print(f"  batch {batch_start//batch_size + 1}: got {len(items)} items")
    except Exception as e:
        print(f"  batch {batch_start//batch_size + 1} FAILED: {e}")
    time.sleep(1.0)

# Merge into JSON
for c in chars:
    if c["id"] in results:
        analysis = results[c["id"]]
        for key in ["famous_quote_tr", "depth_tr", "shadow_tr", "challenge_tr",
                    "as_friend_tr", "as_partner_tr", "career_dna_tr", "growth_arc_tr",
                    "if_you_are_tr"]:
            if key in analysis:
                c[key] = analysis[key]

out_path = os.path.join(os.path.dirname(__file__), "..", "quiz_characters.json")
with open(out_path, "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nDone. Updated {out_path} with {len(results)}/{len(chars)} character analyses.")
sample = data["characters"][35]
print("\nSample (Mark Watney):")
for k in ["famous_quote_tr", "depth_tr", "challenge_tr", "if_you_are_tr"]:
    print(f"  {k}: {sample.get(k, 'MISSING')[:120]}...")
