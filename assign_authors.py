import json
import os

with open('database/data/wix-posts.json', 'r') as f:
    data = json.load(f)

known_authors = {
    'İris Eryılmaz': 'iris@benizledim.com',
    'Gökçe Serim': 'gokce@benizledim.com',
    'Su Evci': 'su@benizledim.com',
    'Muhammed Muğlu': 'muhammed@benizledim.com'
}

default_author_name = 'Gurur Sönmez'
default_author_email = 'gurur@benizledim.com'

author_counts = {}

for post_data in data.get('posts', []):
    author_name = default_author_name
    author_email = default_author_email
    content = post_data.get('content', '')
    
    for k_author, k_email in known_authors.items():
        if k_author in content:
            author_name = k_author
            author_email = k_email
            break
            
    # Some posts might have author in tags (we check just in case)
    if author_name == default_author_name:
        tags_string = "".join(post_data.get('tags', []))
        for k_author, k_email in known_authors.items():
            if k_author in tags_string:
                author_name = k_author
                author_email = k_email
                break

    post_data['author_name'] = author_name
    post_data['author_email'] = author_email
    
    author_counts[author_name] = author_counts.get(author_name, 0) + 1

with open('database/data/wix-posts.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated database/data/wix-posts.json with correct authors.")
print("\nAuthor post counts:")
for a, c in author_counts.items():
    print(f"{a}: {c}")
