#!/usr/bin/env python3
"""Build data/item-of-day.json and images/item-of-day.jpg for the TV "Item of the day" slide.

Usage:  python3 scripts/make_item_of_day.py /workspace/2026-11-06/
        (run from the pias-sd-tv folder, or give any path; output goes next to this script's parent)
Reads the day folder's item.json if present, otherwise the "Item:" line under
"ITEM OF THE DAY" in captions.md. Photo: item_raw.png (raw product photo), else item_of_day.png.
Needs Pillow (pip install pillow). Then upload both output files to GitHub."""
import json, re, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SMALL = {'a', 'an', 'the', 'at', 'of', 'for', 'to', 'in', 'on', 'or', 'and', 'by', 'w/'}

def title_case(name):
    """Title Case a product name; keeps ALL-CAPS/model tokens (MVP, BB/SB, 2500) and 'w/' as-is."""
    out = []
    for i, w in enumerate(name.split()):
        low = w.lower()
        if low.startswith('w/') and i: out.append('w/' + title_case(w[2:]) if len(w) > 2 else 'w/'); continue
        if i and low in SMALL: out.append(low)
        elif w.isalpha() and w.isupper() and len(w) > 3: out.append(w[:1] + w[1:].lower())
        elif any(ch.isdigit() for ch in w) or (w.isupper() and len(w) > 1) or any(ch.isupper() for ch in w[1:]): out.append(w)
        else: out.append('-'.join(p[:1].upper() + p[1:] for p in w.split('-')))
    return ' '.join(out)

def from_captions(text):
    sec = text.split('ITEM OF THE DAY', 1)[1]
    line = re.search(r'^Item:\s*(.+)$', sec, re.M).group(1).strip()
    sku = re.search(r'SKU\s+(?:\d+-)?(S\d+)', line).group(1)
    price = re.search(r'\$(\d+(?:\.\d\d)?)', line).group(1)
    cond = (re.search(r'condition\s+(\w+)', line) or [None, None])[1]
    parts = [p.strip() for p in line.split(',')]
    name = parts[0]
    extras = [p for p in parts[1:] if not re.match(r'(SKU|\$|condition)', p)]
    return {'name': name, 'sku': sku, 'price': price, 'condition': cond, 'details': ', '.join(extras)}

def main(day):
    day = Path(day)
    if (day / 'item.json').exists():
        j = json.loads((day / 'item.json').read_text())
        it = {'name': j['name'], 'sku': re.sub(r'^\d+-', '', j['sku']), 'price': j['price'], 'condition': j.get('condition'),
              'details': ', '.join(x for x in [j.get('color'), j.get('size')] if x)}
        cap = day / 'captions.md'
        if cap.exists():  # use the nicer caption-line name (keeps commas out of the title)
            try: it['name'] = from_captions(cap.read_text())['name']
            except Exception: pass
    else:
        it = from_captions((day / 'captions.md').read_text())
    photo = next((day / f for f in ['item_raw.png', 'item_raw.jpg', 'item_of_day.png'] if (day / f).exists()), None)
    if not photo: sys.exit('No item photo (item_raw.png / item_of_day.png) in ' + str(day))
    im = Image.open(photo).convert('RGBA'); bg = Image.new('RGBA', im.size, 'white'); bg.alpha_composite(im)
    im = bg.convert('RGB'); im.thumbnail((1000, 1000)); im.save(ROOT / 'images/item-of-day.jpg', quality=88, optimize=True)
    price = it['price'] if str(it['price']).startswith('$') else '$' + str(it['price'])
    out = {'title': title_case(it['name']), 'price': price, 'sku': it['sku'], 'details': it.get('details') or '',
           'condition': it.get('condition') or '', 'image': 'images/item-of-day.jpg', 'day': day.name}
    (ROOT / 'data').mkdir(exist_ok=True)
    (ROOT / 'data/item-of-day.json').write_text(json.dumps(out, indent=1) + '\n')
    print(json.dumps(out, indent=1))

if __name__ == '__main__':
    if len(sys.argv) != 2: sys.exit(__doc__)
    main(sys.argv[1])
