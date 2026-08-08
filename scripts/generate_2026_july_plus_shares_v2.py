#!/usr/bin/env python3
"""
Ben İzledim — 2026 Temmuz Sonrası 8 Film Paylaşım Seti (v2)
Black-mode, image-first, Poppins typography, zero-card design.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import json, textwrap, hashlib

# ── paths ──────────────────────────────────────────────────────────────────
PROJECT = Path(__file__).resolve().parents[1]
SRC = PROJECT / 'storage/app/public/images/releases/2026-july-plus'
OUT = PROJECT / 'public/instagram/2026-07-24-benizledim-2026-temmuz-sonrasi-8-film-v2'
SLIDES = OUT / 'slides'
FONTS = OUT / 'assets/fonts'

W, H = 1080, 1350
RED = (220, 38, 38)        # #DC2626
RED_DIM = (180, 25, 35)
WHITE = (255, 255, 255)
OFF_WHITE = (238, 238, 238)
LIGHT_GRAY = (180, 180, 180)
DARK_BG = (10, 10, 12)

# ── fonts ──────────────────────────────────────────────────────────────────
def _font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size=size)

def fblack(size: int):  return _font('Poppins-Black.ttf', size)
def fsemibold(size: int): return _font('Poppins-SemiBold.ttf', size)
def fregular(size: int): return _font('Poppins-Regular.ttf', size)

# ── items ──────────────────────────────────────────────────────────────────
items = [
    {'slug': 'spider-man-brand-new-day', 'image': 'Spider-Man_Brand_New_Day.jpg',
     'rank': '01', 'title': 'SPIDER-MAN:\nBRAND NEW DAY',
     'release': '31 TEMMUZ 2026', 'region': 'TR',
     'genre': 'Aksiyon · Macera · Süper Kahraman',
     'short': 'Marvel\u2019in en güçlü markası bu sezon en büyük açılış savaşını veriyor.'},
    {'slug': 'avatar-the-last-airbender-aang', 'image': 'Avatar_Aang_The_Last_Airbender.jpg',
     'rank': '02', 'title': 'AVATAR:\nTHE LAST AIRBENDER',
     'release': '24 TEMMUZ 2026', 'region': 'TR',
     'genre': 'Animasyon · Fantastik',
     'short': 'Nostalji, strateji ve büyük IP etkisi: gişede güvenli ve güçlü bir aday.'},
    {'slug': 'resident-evil', 'image': 'Resident_Evil.jpg',
     'rank': '03', 'title': 'RESIDENT EVIL',
     'release': '18 EYLÜL 2026', 'region': 'US',
     'genre': 'Korku · Aksiyon',
     'short': 'Korku-aksiyon mirasını yeni kuşağa taşıyan yüksek ilgi alanlı bir geri dönüş.'},
    {'slug': 'dune-part-three', 'image': 'Dune_Part_Three.jpg',
     'rank': '04', 'title': 'DUNE:\nPART THREE',
     'release': '18 ARALIK 2026', 'region': 'TR',
     'genre': 'Bilim Kurgu · Epik',
     'short': '\u201cEn görsel büyük film\u201d beklentisi: kalite ve marka gücü aynı anda yüksek.'},
    {'slug': 'avengers-doomsday', 'image': 'Avengers_Doomsday.jpg',
     'rank': '05', 'title': 'AVENGERS:\nDOOMSDAY',
     'release': '18 ARALIK 2026', 'region': 'TR',
     'genre': 'Aksiyon · Süper Kahraman',
     'short': 'Franchise baskısı ve fan mobilizasyonu en yüksek film adaylarından biri.'},
    {'slug': 'godzilla-minus-zero', 'image': 'Godzilla_Minus_Zero.jpg',
     'rank': '06', 'title': 'GODZILLA\nMINUS ZERO',
     'release': '6 KASIM 2026', 'region': 'TR',
     'genre': 'Canavar · Aksiyon',
     'short': 'Kaos ve afet fantazisi üst düzey seyirci çekiciliğini koruyor.'},
    {'slug': 'cat-in-the-hat', 'image': 'The_Cat_in_the_Hat.jpg',
     'rank': '07', 'title': 'THE CAT\nIN THE HAT',
     'release': '6 KASIM 2026', 'region': 'US',
     'genre': 'Animasyon · Aile',
     'short': 'Aile segmentinde nostaljik uyarlama hattının en güçlü pazarlama çağrışımı.'},
    {'slug': 'angry-birds-movie-3', 'image': 'The_Angry_Birds_Movie_3.jpg',
     'rank': '08', 'title': 'THE ANGRY BIRDS\nMOVIE 3',
     'release': '23 ARALIK 2026', 'region': 'US',
     'genre': 'Animasyon · Komedi',
     'short': 'Animasyon IP\u2019leri içinde genişleyen franchise: sezon sonu yüksek görsel etki.'},
]

# ── helpers ────────────────────────────────────────────────────────────────
def fit_image(src: Path, w: int, h: int) -> Image.Image:
    """Scale source to cover w×h, center-cropped, Lanczos."""
    im = Image.open(src).convert('RGB')
    # enhance slightly for print-like pop
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    # fit with cover semantics
    src_w, src_h = im.size
    scale = max(w / src_w, h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    return im.crop((left, top, left + w, top + h))

def gradient_mask(w: int, h: int, start_y_frac: float = 0.55) -> Image.Image:
    """Black gradient from transparent at start to opaque at bottom."""
    alpha = Image.new('L', (1, h), 0)
    start_y = int(h * start_y_frac)
    for y in range(h):
        if y < start_y:
            alpha.putpixel((0, y), 0)
        else:
            frac = (y - start_y) / (h - start_y)
            # ease-in-out curve
            val = int(220 * (frac ** 1.8))
            alpha.putpixel((0, y), min(val, 220))
    return alpha.resize((w, h))

def draw_gradient_bg(im: Image.Image) -> Image.Image:
    """Apply a dark gradient overlay to the bottom of an image."""
    mask = gradient_mask(W, H, start_y_frac=0.52)
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    overlay.putalpha(mask)
    im_rgba = im.convert('RGBA')
    return Image.alpha_composite(im_rgba, overlay)

def draw_text_line(d: ImageDraw.ImageDraw, x: int, y: int, text: str, font,
                   fill=WHITE, stroke_width: int = 0, stroke_fill=None):
    d.text((x, y), text, font=font, fill=fill,
           stroke_width=stroke_width, stroke_fill=stroke_fill)

def text_size(d: ImageDraw.ImageDraw, text: str, font) -> tuple[int, int]:
    bbox = d.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def wrap_to_width(d: ImageDraw.ImageDraw, text: str, font, max_w: int) -> list[str]:
    """Break text into lines fitting max_w."""
    words = text.split()
    lines = []
    current = ''
    for w in words:
        test = f'{current} {w}'.strip() if current else w
        tw, _ = text_size(d, test, font)
        if tw <= max_w:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    return lines

# ── cover ──────────────────────────────────────────────────────────────────
def render_cover() -> dict:
    """Full-bleed cover: dark overlay across ENTIRE image, bold stacked typography."""
    bg = fit_image(SRC / 'Spider-Man_Brand_New_Day.jpg', W, H)
    bg_rgba = bg.convert('RGBA')

    # ── uniform dark veil across the whole canvas ──
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 120))  # ~47% black
    bg_rgba = Image.alpha_composite(bg_rgba, veil)

    # ── stronger gradient from top to bottom ──
    # Build 1px column then stretch — avoids 1.5M putpixel calls
    col = [0] * H
    for y in range(H):
        if y < H * 0.15:
            col[y] = 140
        else:
            frac = (y - H * 0.15) / (H * 0.85)
            col[y] = min(int(140 + 80 * (frac ** 1.5)), 220)
    mask = Image.new('L', (1, H))
    mask.putdata(col)
    mask = mask.resize((W, H))

    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    overlay.putalpha(mask)
    bg_rgba = Image.alpha_composite(bg_rgba, overlay)

    d = ImageDraw.Draw(bg_rgba)

    # ── top brand badge ──
    badge_w, badge_h = 280, 50
    d.rounded_rectangle([(48, 50), (48 + badge_w, 50 + badge_h)], radius=6, fill=RED)
    draw_text_line(d, 72, 58, 'BEN İZLEDİM', fsemibold(24), WHITE)

    # ── stacked headline block, tightly spaced, centered ──
    # measure all three lines first to calculate block position
    year_font = fblack(150)
    tw_yr, th_yr = text_size(d, '2026', year_font)

    sub_font = fblack(105)
    tw_sub, th_sub = text_size(d, 'TEMMUZ SONRASI', sub_font)

    third_font = fblack(58)
    tw_3, th_3 = text_size(d, 'VIZYONA GIRECEK 8 FILM', third_font)

    gap1, gap2, gap3 = 16, 20, 48
    block_h = th_yr + gap1 + th_sub + gap2 + th_3
    block_start_y = 280  # top of the block

    # "2026"
    draw_text_line(d, (W - tw_yr) // 2, block_start_y, '2026', year_font, WHITE,
                   stroke_width=4, stroke_fill=(0, 0, 0, 180))

    # "TEMMUZ SONRASI"
    sy = block_start_y + th_yr + gap1
    draw_text_line(d, (W - tw_sub) // 2, sy, 'TEMMUZ SONRASI', sub_font, RED,
                   stroke_width=3, stroke_fill=(0, 0, 0, 180))

    # "VIZYONA GIRECEK 8 FILM"
    ty = sy + th_sub + gap2
    draw_text_line(d, (W - tw_3) // 2, ty, 'VIZYONA GIRECEK 8 FILM', third_font, OFF_WHITE,
                   stroke_width=2, stroke_fill=(0, 0, 0, 180))

    # ── red accent line ──
    line_y = ty + th_3 + gap3
    lw = 120
    d.rounded_rectangle([(W//2 - lw, line_y), (W//2 + lw, line_y + 3)], radius=1, fill=RED)

    # ── bottom date line ──
    date_font = fregular(36)
    d.text((W//2, H - 140), 'TEMMUZ — ARALIK 2026', font=date_font, fill=LIGHT_GRAY,
           anchor='mt', stroke_width=1, stroke_fill=(0, 0, 0, 160))

    out = SLIDES / 'slide_00_kapak.png'
    out.parent.mkdir(parents=True, exist_ok=True)
    bg_rgba.convert('RGB').save(out, quality=95, optimize=True)
    return {'output': str(out), 'size': bg_rgba.size, 'bytes': out.stat().st_size}

# ── interior slide ─────────────────────────────────────────────────────────
def render_card(item: dict) -> dict:
    """Full-bleed poster with minimal text overlay at bottom."""
    src_file = SRC / item['image']
    bg = fit_image(src_file, W, H)
    bg_rgba = bg.convert('RGBA')

    # ── subtle dark veil for upper-half readability ──
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 50))  # ~20% black
    bg_rgba = Image.alpha_composite(bg_rgba, veil)

    # softer gradient for bottom text
    mask = gradient_mask(W, H, start_y_frac=0.50)
    overlay_g = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    overlay_g.putalpha(mask)
    bg_rgba = Image.alpha_composite(bg_rgba, overlay_g)

    d = ImageDraw.Draw(bg_rgba)

    # ── dark backdrop panel behind bottom text block ──
    panel_top = H - 500
    panel_bottom = H - 16
    panel_left = 36
    panel_right = W - 36
    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle(
        [(panel_left, panel_top), (panel_right, panel_bottom)],
        radius=20, fill=(8, 8, 12, 155),
        outline=None
    )
    bg_rgba = Image.alpha_composite(bg_rgba, panel)
    d = ImageDraw.Draw(bg_rgba)

    # huge rank number — top-left, solid white with strong stroke
    rank_font = fblack(280)
    rank_text = item['rank']
    tw_r, th_r = text_size(d, rank_text, rank_font)
    draw_text_line(d, 60, 40, rank_text, rank_font,
                   WHITE, stroke_width=4, stroke_fill=(0, 0, 0, 200))

    # thin red accent line under rank
    line_y = 40 + th_r + 16
    d.rectangle([(64, line_y), (144, line_y + 3)], fill=RED)

    # title — huge, bottom gradient zone, white
    title_font = fblack(100)
    title_lines = item['title'].split('\n')
    # or auto-wrap if single line too long
    if '\n' not in item['title']:
        title_lines = wrap_to_width(d, item['title'], title_font, W - 120)
        if len(title_lines) > 2:
            # shrink if needed
            for sz in range(100, 56, -4):
                title_font = fblack(sz)
                title_lines = wrap_to_width(d, item['title'], title_font, W - 120)
                if len(title_lines) <= 2:
                    break
            title_lines = title_lines[:2]

    # measure total title block
    line_heights = [text_size(d, ln, title_font)[1] for ln in title_lines]
    total_th = sum(line_heights) + (len(title_lines) - 1) * 8

    title_start_y = H - 420
    ty = title_start_y
    for i, ln in enumerate(title_lines):
        draw_text_line(d, 64, ty, ln, title_font, WHITE,
                       stroke_width=2, stroke_fill=(0, 0, 0))
        ty += line_heights[i] + 8

    # release + genre line
    release_font = fsemibold(34)
    release_text = f"{item['release']}  ·  {item['region']}  ·  {item['genre']}"
    # check width, wrap if needed
    rtw, rth = text_size(d, release_text, release_font)
    if rtw > W - 120:
        release_font = fregular(30)
        rtw, rth = text_size(d, release_text, release_font)
    draw_text_line(d, 68, ty + 12, release_text, release_font, RED_DIM,
                   stroke_width=1, stroke_fill=(0, 0, 0))

    # short evaluation line
    short_font = fregular(38)
    short_lines = wrap_to_width(d, item['short'], short_font, W - 140)
    short_lines = short_lines[:2]  # max 2 lines
    sy = ty + rth + 28
    for ln in short_lines:
        draw_text_line(d, 68, sy, ln, short_font, OFF_WHITE,
                       stroke_width=1, stroke_fill=(0, 0, 0))
        sy += text_size(d, ln, short_font)[1] + 6

    # bottom brand line
    brand_font = fsemibold(22)
    btw, bth = text_size(d, 'BEN İZLEDİM', brand_font)
    bx = W - btw - 64
    by = H - 70
    # red underline
    d.rectangle([(bx, by + bth + 4), (bx + btw, by + bth + 6)], fill=RED)
    draw_text_line(d, bx, by, 'BEN İZLEDİM', brand_font, LIGHT_GRAY)

    # bottom red bar
    d.rectangle([(0, H - 4), (W, H)], fill=RED)

    slug = item['slug']
    out = SLIDES / f'slide_{item["rank"]}_{slug}.png'
    out.parent.mkdir(parents=True, exist_ok=True)
    bg_rgba.convert('RGB').save(out, quality=95, optimize=True)

    return {
        'source': str(src_file),
        'output': str(out),
        'size': bg_rgba.size,
        'bytes': out.stat().st_size,
        'title': item['title'].replace('\n', ' '),
        'release': item['release'],
        'rank': item['rank'],
    }

# ── contact sheet ──────────────────────────────────────────────────────────
def make_contact_sheet(outputs: list[dict]):
    """3×3 grid preview."""
    cols, rows = 3, 3
    thumb_w, thumb_h = 360, 450
    pad = 12
    cw = cols * thumb_w + (cols + 1) * pad
    ch = rows * thumb_h + (rows + 1) * pad + 40

    sheet = Image.new('RGB', (cw, ch), (20, 20, 24))
    d = ImageDraw.Draw(sheet)

    # title
    d.text((cw//2, 14), 'BEN İZLEDİM — 2026 TEMMUZ SONRASI 8 FİLM (v2)', 
           font=fsemibold(18), fill=LIGHT_GRAY, anchor='mt')

    for i, out in enumerate(outputs):
        row, col = divmod(i, cols)
        x = pad + col * (thumb_w + pad)
        y = 50 + row * (thumb_h + pad)
        try:
            thumb = Image.open(out['output']).resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            sheet.paste(thumb, (x, y))
        except Exception:
            d.rectangle([(x, y), (x + thumb_w, y + thumb_h)], fill=(40, 40, 40))
        # label
        label = Path(out['output']).stem
        d.text((x + 4, y + thumb_h - 20), label, font=fregular(11), fill=LIGHT_GRAY,
               stroke_width=1, stroke_fill=(0, 0, 0))

    cs_path = OUT / 'contact_sheet.png'
    sheet.save(cs_path, quality=90)
    return cs_path

# ── QA ─────────────────────────────────────────────────────────────────────
def run_qa(outputs: list[dict]) -> tuple[dict, list]:
    metrics = {}
    issues = []
    for out in outputs:
        sz = out['size']
        ok = (sz[0] == W and sz[1] == H)
        metrics[Path(out['output']).name] = {'size': list(sz), 'size_ok': ok, 'bytes': out['bytes']}
        if not ok:
            issues.append(f"{out['output']}: bad size {sz}")
    return metrics, issues

# ── main ───────────────────────────────────────────────────────────────────
def main():
    # Clean stale output
    if SLIDES.exists():
        import shutil
        shutil.rmtree(SLIDES)
    SLIDES.mkdir(parents=True, exist_ok=True)

    outputs = []

    # Cover
    print('Rendering cover...')
    cov = render_cover()
    outputs.append(cov)
    print(f'  ✓ slide_00_kapak.png')

    # Cards
    for i, item in enumerate(items):
        print(f'Rendering {item["rank"]}/08: {item["title"][:40]}...')
        card = render_card(item)
        outputs.append(card)
        print(f'  ✓ {Path(card["output"]).name} ({card["size"][0]}x{card["size"][1]})')

    # QA
    metrics, issues = run_qa(outputs)
    (OUT / 'qa_metrics.json').write_text(json.dumps(metrics, indent=2, ensure_ascii=False))
    (OUT / 'render_issues.json').write_text(json.dumps(issues, indent=2, ensure_ascii=False))
    print(f'\nQA: {len(metrics)} slides checked, {len(issues)} issues')

    # Contact sheet
    cs = make_contact_sheet(outputs)
    print(f'Contact sheet: {cs}')

    # Slide copy manifest
    copy_data = {
        'topic': '2026 Temmuz sonrası vizyona girecek 8 film',
        'items': [
            {**{k: v for k, v in it.items() if k != 'image'},
             'slide': Path(out['output']).name,
             'source_file': it['image']}
            for it, out in zip(items, outputs[1:])
        ],
        'generated_at': '2026-07-24T00:00:00+03:00',
        'version': 'v2-black-mode'
    }
    (OUT / 'slide_copy.json').write_text(json.dumps(copy_data, indent=2, ensure_ascii=False))

    # Caption
    caption = (
        '2026 Temmuz sonrası vizyona girecek en önemli 8 film — Ben İzledim seçkisi.\n\n'
        'Spider-Man: Brand New Day\'den Dune: Part Three\'e, '
        'Avengers: Doomsday\'den Resident Evil\'e…\n'
        'Bu sezon sinema salonlarında neler var, hangisi seni heyecanlandırıyor?\n\n'
        '#benizledim #sinema #vizyon #2026filmler'
    )
    (OUT / 'caption_post.txt').write_text(caption)

    # TESLIM
    teslim = (
        'Ben İzledim — 2026 Temmuz Sonrası 8 Film Kapak Seti (v2 Black Mode)\n\n'
        'Üretilen dosyalar:\n'
        '- slides/ (1 kapak + 8 kart, 1080x1350 PNG)\n'
        '- contact_sheet.png\n'
        '- slide_copy.json, qa_metrics.json, render_issues.json\n'
        '- caption_post.txt\n\n'
        'Tasarım: Saf siyah mod, Poppins tipografi, tam ekran görsel, '
        'kırmızı mikro vurgu, sıfır kart/gölge.\n'
    )
    (OUT / 'TESLIM.txt').write_text(teslim)

    print(f'\n✓ Done. Output: {OUT}')
    print(f'  {len(outputs)} slides total ({len(outputs)-1} cards + cover)')

if __name__ == '__main__':
    main()
