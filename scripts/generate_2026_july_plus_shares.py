from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance
import json

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = PROJECT_ROOT / 'storage/app/public/images/releases/2026-july-plus'
OUTPUT_DIR = PROJECT_ROOT / 'public/instagram/2026-07-24-benizledim-2026-temmuz-sonrasi-8-film-v1'
SLIDE_DIR = OUTPUT_DIR / 'slides'
ASSET_DIR = OUTPUT_DIR / 'assets/final'

W, H = 1080, 1350

items = [
    {
        'slug': 'spider-man-brand-new-day',
        'image': 'Spider-Man_Brand_New_Day.jpg',
        'rank': '01',
        'title': 'Spider-Man: Brand New Day',
        'release': '31/07/2026',
        'region': 'TR',
        'genre': 'Aksiyon • Macera • Süper Kahraman',
        'short': 'Marvel evrenindeki güçlü marka etkisi, güçlü görsel ritim ve güçlü pazarlama potansiyeliyle bu sezonun en güçlü açılış savaşını taşıyor.'
    },
    {
        'slug': 'avatar-the-last-airbender-aang',
        'image': 'Avatar_Aang_The_Last_Airbender.jpg',
        'rank': '02',
        'title': 'Avatar: The Last Airbender (Aang)',
        'release': '24/07/2026',
        'region': 'TR',
        'genre': 'Animasyon • Fantastik',
        'short': 'Nostalji + fantasy savaş stratejisi + büyük IP etkisi: gişe tarafında güvenli ama doğru çerçevede güçlü bir aday.'
    },
    {
        'slug': 'resident-evil',
        'image': 'Resident_Evil.jpg',
        'rank': '03',
        'title': 'Resident Evil',
        'release': '18/09/2026',
        'region': 'US',
        'genre': 'Korku • Aksiyon',
        'short': 'Korku-aksiyon evreninde güçlü marka mirasını yeni kuşağa götürme avantajı olan, yüksek ilgi alanlı bir geri dönüş.'
    },
    {
        'slug': 'dune-part-three',
        'image': 'Dune_Part_Three.jpg',
        'rank': '04',
        'title': 'Dune: Part Three',
        'release': '18/12/2026',
        'region': 'TR',
        'genre': 'Bilim Kurgu • Epik',
        'short': 'Dune ekosistemi, “en görsel büyük film” beklentisini taşıyor; kalite ve marka gücü aynı anda yüksek.'
    },
    {
        'slug': 'avengers-doomsday',
        'image': 'Avengers_Doomsday.jpg',
        'rank': '05',
        'title': 'Avengers: Doomsday',
        'release': '18/12/2026',
        'region': 'TR',
        'genre': 'Aksiyon • Süper Kahraman',
        'short': 'Franchise baskısı, global sosyal etki, fan mobilizasyonu ve pazarlama çarpanı en yüksek film adaylarından biri.'
    },
    {
        'slug': 'godzilla-minus-zero',
        'image': 'Godzilla_Minus_Zero.jpg',
        'rank': '06',
        'title': 'Godzilla Minus Zero',
        'release': '06/11/2026',
        'region': 'TR',
        'genre': 'Canavar • Aksiyon',
        'short': 'Kaos/afet fantazisi üst düzey seyirci çekiciliğini koruyor; güçlü görsel kurgularla ana akımda kalma şansı yüksek.'
    },
    {
        'slug': 'cat-in-the-hat',
        'image': 'The_Cat_in_the_Hat.jpg',
        'rank': '07',
        'title': 'The Cat in the Hat',
        'release': '06/11/2026',
        'region': 'US',
        'genre': 'Animasyon • Aile',
        'short': 'Aile segmentini hedefleyen nostaljik uyarlama hattında en güçlü pazarlama çağrışımlarından biri.'
    },
    {
        'slug': 'angry-birds-movie-3',
        'image': 'The_Angry_Birds_Movie_3.jpg',
        'rank': '08',
        'title': 'The Angry Birds Movie 3',
        'release': '23/12/2026',
        'region': 'US',
        'genre': 'Animasyon • Komedi',
        'short': 'Animasyon IP’leri içinde genişleyen franchise kalıbına uygun; sezon sonu takviminde yüksek görselle etki alanına sahip.'
    },
]

FONT_PATHS = {
    'bold': [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/Library/Fonts/Arial Unicode.ttf',
        '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
    ],
    'regular': [
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/Library/Fonts/Arial Unicode.ttf',
        '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
        '/System/Library/Fonts/SFNS.ttf',
    ],
}


def load_font(size: int, bold: bool = False):
    paths = FONT_PATHS['bold' if bold else 'regular']
    for p in paths:
        fp = Path(p)
        if fp.exists():
            return ImageFont.truetype(str(fp), size=size)
    return ImageFont.load_default()


def text_w(draw: ImageDraw.ImageDraw, text: str, font):
    return draw.textbbox((0, 0), text, font=font)[2]


def text_h(font):
    return font.getbbox('Hg')[3] - font.getbbox('Hg')[1]


def wrap_lines(draw: ImageDraw.ImageDraw, text: str, font, max_width: int):
    words = text.split()
    lines = []
    current = ''
    for w in words:
        test = f"{current} {w}".strip()
        if text_w(draw, test, font) <= max_width or not current:
            current = test
            continue
        lines.append(current)
        current = w
    if current:
        lines.append(current)
    return lines


def fit_text(draw, text, font_key, max_width, max_lines, max_size, min_size, target_width=None):
    for size in range(max_size, min_size - 1, -2):
        font = load_font(size, bold=(font_key == 'bold'))
        lines = wrap_lines(draw, text, font, max_width)
        if target_width and target_width < len(lines):
            lines = lines[:target_width]
            break
        if len(lines) <= max_lines:
            # 1.4 line spacing tolerance by checking height budget
            est_h = len(lines) * (text_h(font) + 8) + 6
            if est_h <= 520:
                return font, lines
    # fallback with min size, keep at most max_lines lines
    font = load_font(min_size, bold=(font_key == 'bold'))
    lines = wrap_lines(draw, text, font, max_width)[:max_lines]
    return font, lines


def fit_overlay_gradient(w: int, h: int, top_alpha: int = 24, bottom_alpha: int = 245):
    values = [int(top_alpha + (bottom_alpha - top_alpha) * ((y / (h - 1)) ** 1.22)) for y in range(h)]
    alpha = Image.new('L', (1, h), 0)
    alpha.putdata(values)
    return alpha.resize((w, h))


def draw_text_lines(draw, lines, x, y, font, fill, gap=10):
    yy = y
    for ln in lines:
        draw.text((x, yy), ln, font=font, fill=fill)
        yy += text_h(font) + gap
    return yy


def draw_single_card(item, out_path: Path, rank_text: str):
    poster = Image.open(SOURCE_DIR / item['image']).convert('RGB')
    bg = ImageOps.fit(poster, (W, H), method=Image.Resampling.LANCZOS)
    bg = ImageEnhance.Contrast(bg).enhance(1.05)

    base = Image.new('RGBA', (W, H))
    bg_rgba = bg.convert('RGBA')
    base.alpha_composite(bg_rgba)

    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    alpha = fit_overlay_gradient(W, H)
    overlay_alpha = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    overlay_alpha.putalpha(alpha)
    base = Image.alpha_composite(base, overlay_alpha)

    # highlight panel for text readability
    panel_top = 840
    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle((26, panel_top, W - 26, H - 24), radius=34, fill=(8, 8, 12, 238), outline=(205, 12, 36, 255), width=3)
    base = Image.alpha_composite(base, panel)

    d = ImageDraw.Draw(base)
    brand_font = load_font(30, bold=True)
    tag_font = load_font(24, bold=True)
    big_font = load_font(30, bold=True)

    # top corner tag
    d.rounded_rectangle((56, 56, 308, 108), radius=16, fill=(17, 17, 19, 225), outline=(205, 12, 36, 255), width=2)
    d.text((72, 68), '2026 TEMMUZ SONRASI', font=tag_font, fill=(232, 232, 232))

    d.rounded_rectangle((W - 205, 54, W - 68, 108), radius=14, fill=(205, 12, 36, 240), outline=(255, 130, 130, 255), width=2)
    d.text((W - 199, 72), f'{rank_text} / 08', font=load_font(29, bold=True), fill=(255, 255, 255))

    # title area
    title_max_w = W - 130
    title_font = load_font(82, bold=True)
    title_lines = [item['title']]
    for size in range(92, 48, -2):
        title_font = load_font(size, bold=True)
        title_lines = wrap_lines(d, item['title'], title_font, title_max_w)
        if len(title_lines) <= 3:
            break
    if len(title_lines) > 3:
        title_lines = title_lines[:2]
        title_font = load_font(56, bold=True)
        title_lines = wrap_lines(d, item['title'], title_font, title_max_w)
        title_lines = title_lines[:3]

    ty = panel_top + 34
    title_color = (251, 248, 250)
    ty = draw_text_lines(d, title_lines, 64, ty, title_font, title_color, gap=8)

    # release line
    d.rounded_rectangle((64, ty + 12, 450, ty + 54), radius=12, fill=(28, 10, 14, 220), outline=(112, 18, 32, 255), width=1)
    d.text((84, ty + 21), f"{item['release']} · {item['region']}", font=big_font, fill=(255, 255, 255))
    ty += 78

    # subtitle/genre line
    d.text((72, ty + 4), item['genre'], font=load_font(30), fill=(198, 198, 198))
    ty += 54

    # reason block
    reason_font = load_font(40)
    reason_lines = wrap_lines(d, item['short'], reason_font, W - 132)
    if len(reason_lines) > 5:
        reason_lines = reason_lines[:4]
        # add ellipsis to last line if cut
        if reason_lines[-1] and not reason_lines[-1].endswith('…'):
            reason_lines[-1] = reason_lines[-1].rstrip('.') + '…'

    # keep block inside panel with two-tone separator
    d.text((66, ty + 4), 'NEDEN BAKMALI:', font=load_font(27, bold=True), fill=(255, 150, 160))
    ty += 40
    for line in reason_lines:
        if ty > H - 150:
            break
        d.text((66, ty + 6), f'• {line}', font=reason_font, fill=(240, 240, 240))
        ty += text_h(reason_font) + 12

    # footer
    d.rounded_rectangle((64, H - 72, 388, H - 38), radius=12, fill=(205, 12, 36, 230), outline=(255, 130, 130, 255), width=1)
    d.text((82, H - 64), 'BEN İZLEDİM FİLM TAKVİMİ', font=load_font(24, bold=True), fill=(255, 255, 255))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    base.convert('RGB').save(out_path, quality=95, optimize=True)

    return {
        'source': str(SOURCE_DIR / item['image']),
        'output': str(out_path),
        'size': base.size,
        'bytes': out_path.stat().st_size,
        'title': item['title'],
        'release': item['release'],
        'rank': item['rank'],
    }


def make_main_cover(out_path: Path):
    poster = Image.open(SOURCE_DIR / items[0]['image']).convert('RGB')
    base = ImageOps.fit(poster, (W, H), method=Image.Resampling.LANCZOS)
    base = ImageEnhance.Contrast(base).enhance(1.08)
    base = base.convert('RGBA')

    # warm texture and darken
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    alpha = fit_overlay_gradient(W, H, top_alpha=18, bottom_alpha=230)
    overlay.putalpha(alpha)
    base = Image.alpha_composite(base, overlay)

    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle((22, 22, W - 22, H - 22), radius=34, fill=(8, 8, 10, 236), outline=(205, 12, 36, 255), width=3)
    base = Image.alpha_composite(base, panel)

    d = ImageDraw.Draw(base)
    # header area
    d.rounded_rectangle((62, 56, 430, 106), radius=14, fill=(205, 12, 36, 235), outline=(255, 120, 130, 255), width=2)
    d.text((82, 76), 'VİZYONA GİRECEK', font=load_font(29, bold=True), fill=(255, 255, 255))

    d.rounded_rectangle((446, 56, 810, 106), radius=14, fill=(18, 18, 20, 232), outline=(205, 12, 36, 255), width=2)
    d.text((466, 76), '2026 TEMMUZ SONRASI', font=load_font(29, bold=True), fill=(240, 240, 240))

    # main title
    title_lines, title_font = ['8 FİLM', 'VİZYON TAKVİMİ'], load_font(112, bold=True)
    t_y = 146
    d.text((64, t_y), title_lines[0], font=title_font, fill=(255, 255, 255))
    d.text((64, t_y + 122), title_lines[1], font=load_font(84, bold=True), fill=(205, 12, 36))

    # list panel
    left_x = 74
    right_x = W // 2 + 8
    start_y = 360
    row_h = 106

    row_font = load_font(46, bold=True)
    sub_font = load_font(36)

    for i, item in enumerate(items, start=1):
        col_x = left_x if i <= 4 else right_x
        row_index = i - 1 if i <= 4 else i - 5
        y = start_y + row_index * row_h

        d.rounded_rectangle((col_x, y, col_x + 78, y + 58), radius=12, fill=(205, 12, 36, 235), outline=(255, 120, 130, 255), width=2)
        d.text((col_x + 20, y + 14), f'{i:02d}', font=row_font, fill=(255, 255, 255))

        title = item['title']
        t_lines = wrap_lines(d, title, sub_font, W // 2 - 120)
        t_lines = t_lines[:2]
        if len(t_lines) == 2:
            # truncate second line if still too long
            if len(t_lines[1]) > 32:
                t_lines[1] = t_lines[1][:31] + '…'
        t_y_local = y + 2
        for ln in t_lines:
            d.text((col_x + 94, t_y_local), ln, font=sub_font, fill=(232, 232, 232))
            t_y_local += 52

        d.text((col_x + 94, y + 72), f"{item['release']} · {item['region']}", font=load_font(28), fill=(196, 196, 196))

    # footer
    d.rounded_rectangle((62, H - 86, 420, H - 44), radius=12, fill=(205, 12, 36, 240), outline=(255, 120, 130, 255), width=1)
    d.text((86, H - 75), 'BEN İZLEDİM FİLM TAKVİMİ', font=load_font(28, bold=True), fill=(255, 255, 255))

    base.convert('RGB').save(out_path, quality=95, optimize=True)


def build_contact_sheet(image_paths):
    cols = 4
    thumb_w, thumb_h = 270, 338
    rows = (len(image_paths) + cols - 1) // cols
    sheet_w = cols * thumb_w
    sheet_h = rows * thumb_h
    sheet = Image.new('RGB', (sheet_w, sheet_h), (11, 11, 14))
    for i, path in enumerate(image_paths):
        im = Image.open(path).convert('RGB').resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = (i % cols) * thumb_w
        y = (i // cols) * thumb_h
        sheet.paste(im, (x, y))
    return sheet


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SLIDE_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)

    outputs = []

    # copy final source images
    for item in items:
        source = SOURCE_DIR / item['image']
        target = ASSET_DIR / item['image']
        if target.exists():
            target.unlink()
        target.write_bytes(source.read_bytes())

    # main cover + slides
    cover_path = SLIDE_DIR / 'slide_00_kapak.png'
    make_main_cover(cover_path)

    for i, item in enumerate(items, start=1):
        out = SLIDE_DIR / f"slide_{i:02d}_{item['slug']}.png"
        data = draw_single_card(item, out, item['rank'])
        outputs.append({
            **data,
            'slide_file': str(out.relative_to(PROJECT_ROOT)),
            'cover_file': str(cover_path.name),
            'slug': item['slug'],
            'genre': item['genre']
        })

    contact_path = OUTPUT_DIR / 'contact_sheet.png'
    contact = build_contact_sheet(sorted(SLIDE_DIR.glob('slide_*.png')))
    contact.save(contact_path, quality=95, optimize=True)

    # QA metrics
    qa_metrics = []
    for item in outputs:
        p = Path(item['output'])
        im = Image.open(p)
        qa_metrics.append({
            'slide': p.name,
            'size': list(im.size),
            'size_ok': list(im.size) == [1080, 1350],
            'bytes': p.stat().st_size,
        })
    cols = 4
    contact_im = Image.open(contact_path)
    qa_metrics.append({
        'slide': contact_path.name,
        'size': list(contact_im.size),
        'size_ok': contact_im.size[0] == cols * 270 and contact_im.size[1] == ((len(outputs) + 1 + cols - 1) // cols) * 338,
        'bytes': contact_path.stat().st_size,
    })

    (OUTPUT_DIR / 'qa_metrics.json').write_text(json.dumps({'slides': qa_metrics}, ensure_ascii=False, indent=2), encoding='utf-8')

    (OUTPUT_DIR / 'slide_copy.json').write_text(
        json.dumps(
            {
                'topic': '2026 Temmuz sonrası vizyona girecek 8 film',
                'items': [
                    {
                        'slug': item['slug'],
                        'title': item['title'],
                        'release': item['release'],
                        'region': item['region'],
                        'genre': item['genre'],
                        'rank': item['rank'],
                        'short': item['short'],
                        'slide': f"slide_{idx+1:02d}_{item['slug']}.png",
                        'source_file': item['image'],
                    }
                    for idx, item in enumerate(items)
                ],
                'generated_at': '2026-07-24T00:00:00+03:00'
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding='utf-8'
    )


    render_issues = []
    for it in outputs:
        if len(Image.open(it['output']).size) != 2 or Image.open(it['output']).size[0:2] != (1080, 1350):
            render_issues.append({'slide': Path(it['output']).name, 'message': 'invalid_size'})

    if contact_path.stat().st_size == 0:
        render_issues.append({'file': 'contact_sheet.png', 'message': 'empty_file'})

    (OUTPUT_DIR / 'render_issues.json').write_text(json.dumps(render_issues, ensure_ascii=False, indent=2), encoding='utf-8')

    # caption + index page (opsiyonel kullanım)
    caption = (
        "2026 Temmuz sonrası 8 beklenen filmden oluşan kapak seti. "
        "Sosyal paylaşım için hazır 1080x1350 görseller.\n\n"
        "Sıralama: 1'den 8'e, tarih + kısa değerlendirme dahil.\n"
        "Hashtag: #benizledim #sinema #vizyon #film\n"
        "Not: Bu görseller doğrudan paylaşım için hazırdır."
    )
    (OUTPUT_DIR / 'caption_post.txt').write_text(caption, encoding='utf-8')
    (OUTPUT_DIR / 'TESLIM.txt').write_text(
        "Ben İzledim — 2026 Temmuz Sonrası 8 Film Kapak Seti Teslimi\n\n"
        "Üretilen dosyalar:\n"
        "- slides/slide_00_kapak.png (başlık kapağı)\n"
        "- slides/slide_01_... slide_08_... (8 film kartı, 1080x1350)\n"
        "- contact_sheet.png: hızlı görsel kontrol\n"
        "- slide_copy.json: kart metinleri + mapping\n"
        "- qa_metrics.json: boyut ve byte kontrolü\n"
        "- render_issues.json: otomatik QA çıktısı\n"
        "- caption_post.txt: paylaşım metni\n"
        "- assets/final/: yazı-katmanı uygulanmamış ham görseller\n",
        encoding='utf-8'
    )

    # create quick HTML index
    index_lines = [
        '<!doctype html>',
        '<html lang="tr">',
        '<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>',
        '<title>Ben İzledim — 2026 Temmuz Sonrası 8 Film</title>',
        '<style>body{font-family:Arial,Helvetica,sans-serif;background:#050505;color:#f2f2f2;padding:20px}a{color:#ff4b5f;text-decoration:none}ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:0;list-style:none}li{background:#111;padding:12px;border-radius:8px}img{width:100%;height:auto;display:block;border-radius:8px;border:1px solid #262626}</style>',
        '</head><body>',
        '<h1>2026 Temmuz Sonrası 8 Film — Paylaşım Kapağı</h1>',
        '<p>1080x1350, tek tıklamayla paylaşılabilir PNG seti</p>',
        '<ul>',
    ]
    for file in sorted(SLIDE_DIR.glob('slide_*.png')):
        index_lines.append(f'<li><strong>{file.name}</strong><br><a href="slides/{file.name}"><img src="slides/{file.name}" alt="{file.name}"></a></li>')
    index_lines.extend(['</ul>', '<p><a href="contact_sheet.png">contact_sheet</a> · <a href="slide_copy.json">slide_copy.json</a> · <a href="caption_post.txt">caption_post.txt</a></p>', '</body></html>'])

    (OUTPUT_DIR / 'index.html').write_text('\n'.join(index_lines), encoding='utf-8')

    print('Generated share set in:', OUTPUT_DIR)
    print('Slides:', len(list(SLIDE_DIR.glob('slide_*.png'))))
    print('Contact:', contact_path)


if __name__ == '__main__':
    main()
