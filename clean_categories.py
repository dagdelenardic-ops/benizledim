import json
import re

with open('database/data/wix-posts.json', 'r') as f:
    data = json.load(f)

# Heuristic keyword match mapping
keyword_map = {
    'Sinema': ['film', 'sinema', 'yönetmen', 'vizyon'],
    'Dizi': ['dizi', 'sezon', 'bölüm'],
    'Belgesel': ['belgesel'],
    'Kısa Film': ['kısa film'],
    'Netflix': ['netflix'],
    'Suç ve Gizem': ['suç', 'gizem', 'cinayet', 'gerilim', 'dedektif', 'katil'],
    'Disney Plus': ['disney plus', 'disney+', 'disney'],
    'Deneysel': ['deneysel', 'avangard'],
    'Haber': ['haber', 'duyuru', 'açıklandı', 'gelişme'],
    'GAIN': ['gain'],
    'Dram': ['dram', 'trajedi', 'hüzün'],
    'Komedi': ['komedi', 'komik', 'mizah', 'eğlenceli'],
    'Tarih': ['tarih', 'dönem'],
    'Marvel': ['marvel', 'avengers', 'örümcek adam', 'spider-man', 'iron man', 'kaptan amerika'],
    'Korku': ['korku', 'korkunç', 'paranormal', 'vahşet'],
    'Romantik': ['romantik', 'aşk', 'sevgili'],
    'Bilim ve Kurgu': ['bilimkurgu', 'bilim kurgu', 'uzay', 'distopya', 'gelicek', 'robot', 'yapay zeka'],
    'Süper Kahraman Filmleri': ['süper kahraman', 'superhero', 'batman', 'superman', 'dc'],
    'Sitcom': ['sitcom'],
    'Mafya': ['mafya', 'racon', 'suç örgütü'],
    'MUBI': ['mubi'],
    'Star Wars': ['star wars', 'yıldız savaşları', 'jedi', 'sith', 'darth'],
    'Animasyon': ['animasyon', 'çizgi film', 'anime', 'pixar'],
    'Absürt': ['absürt'],
    'Filmekimi': ['filmekimi'],
    'İstanbul Film Festivali': ['istanbul film festivali', 'iksv'],
    'Amazon Prime': ['amazon prime', 'prime video'],
    'Apple TV+': ['apple tv+', 'apple tv']
}

updated_count = 0
fallback_count = 0

for p in data['posts']:
    content = p.get('content', '')
    title = p.get('title', '').lower()
    text = content.lower()
    
    # 1. Try to extract explicit categories
    match = re.search(r'<ul[^>]*aria-label="Post categories"[^>]*>(.*?)</ul>', content)
    if match:
        ul_content = match.group(1)
        cats = re.findall(r'>([^<]+)</a>', ul_content)
        if cats:
            # We found the explicit categories! Override the global ones.
            p['categories'] = list(set([c.strip() for c in cats if c.strip()]))
            updated_count += 1
            continue
            
    # 2. Fallback: Heuristics based on title and content
    assigned_cats = set()
    for cat, keywords in keyword_map.items():
        # Check title first (higher weight, more likely to signify main topic)
        if any(kw in title for kw in keywords):
            assigned_cats.add(cat)
            
    # If title wasn't enough, look at content, but require a bit more strictness to avoid noise,
    # or just use it. Since it's a fallback, let's just add categories if they exist in text
    if not assigned_cats:
        for cat, keywords in keyword_map.items():
            if any(kw in text for kw in keywords):
                assigned_cats.add(cat)
                
    # Default fallback
    if 'dizi' in title or 'sezon' in title:
        assigned_cats.add('Dizi')
    elif 'film' in title or 'sinema' in title:
        assigned_cats.add('Sinema')
        
    if not assigned_cats:
        assigned_cats.add('Sinema') # Ultimate fallback is cinema/film
        
    p['categories'] = list(assigned_cats)
    fallback_count += 1

with open('database/data/wix-posts.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {updated_count} posts using explicit HTML categories.")
print(f"Updated {fallback_count} posts using heuristic matching.")
print("wix-posts.json has been overwritten.")
