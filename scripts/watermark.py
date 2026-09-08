#!/usr/bin/env python3
"""Stamp a text watermark onto the bottom-right corner of images/*.jpg.

Usage:
    .venv/bin/python scripts/watermark.py [images/one.jpg ...]

With no arguments, watermarks every .jpg in images/ that isn't already
marked (tracked via a small state file so re-runs are safe).
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = REPO_ROOT / "images"
STATE_FILE = REPO_ROOT / "scripts" / ".watermarked"
WATERMARK_TEXT = "© Mrugen Deshmukh"
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"
MARGIN_RATIO = 0.02
FONT_SIZE_RATIO = 0.022


def watermark(path: Path) -> None:
    img = Image.open(path).convert("RGB")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    font_size = max(14, int(img.width * FONT_SIZE_RATIO))
    font = ImageFont.truetype(FONT_PATH, font_size)

    margin = int(img.width * MARGIN_RATIO)
    bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = img.width - text_w - margin
    y = img.height - text_h - margin

    draw.text((x + 1, y + 1), WATERMARK_TEXT, font=font, fill=(0, 0, 0, 140))
    draw.text((x, y), WATERMARK_TEXT, font=font, fill=(255, 255, 255, 170))

    Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB").save(
        path, quality=92
    )
    print(f"watermarked {path.relative_to(REPO_ROOT)}")


def load_state() -> set[str]:
    if not STATE_FILE.exists():
        return set()
    return set(STATE_FILE.read_text().splitlines())


def save_state(done: set[str]) -> None:
    STATE_FILE.write_text("\n".join(sorted(done)) + "\n")


def main() -> None:
    explicit = [Path(p) for p in sys.argv[1:]]
    if explicit:
        for p in explicit:
            watermark(p)
        return

    done = load_state()
    targets = sorted(IMAGES_DIR.glob("*.jpg"))
    newly_done = set(done)
    for path in targets:
        rel = str(path.relative_to(REPO_ROOT))
        if rel in done:
            continue
        watermark(path)
        newly_done.add(rel)
    save_state(newly_done)


if __name__ == "__main__":
    main()
