#!/usr/bin/env python3
"""Put every cubemap face on the same axis: floor down, ceiling up, this room only."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

PANO = Path("/workspace/public/pano")
SIZE = 1024
WALLS = ("px", "nx", "pz", "nz")
ROOMS = [
    "kitchen",
    "living",
    "bed1",
    "bed2",
    "bath",
    "dining",
    "cottage",
    "stair",
    "balcony",
    "deck-canal",
    "deck-beach",
    "ext-canal",
    "ext-beach",
    "ext-gate",
]
OUTDOOR = {
    "balcony",
    "deck-canal",
    "deck-beach",
    "ext-canal",
    "ext-beach",
    "ext-gate",
}


def load(path: Path) -> Image.Image:
    return Image.open(path).convert("RGB").resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def luma_map(im: Image.Image) -> np.ndarray:
    a = np.asarray(im, dtype=np.float32)
    return a[:, :, 0] * 0.299 + a[:, :, 1] * 0.587 + a[:, :, 2] * 0.114


def warm_map(im: Image.Image) -> np.ndarray:
    a = np.asarray(im, dtype=np.float32)
    return a[:, :, 0] - a[:, :, 2]


def floor_at_bottom_score(im: Image.Image) -> float:
    """Wall photos: ceiling is bright on top, teak floor darker/warmer at bottom."""
    y = luma_map(im)
    w = warm_map(im)
    h = y.shape[0]
    top = y[: h // 3].mean()
    bot = y[2 * h // 3 :].mean()
    bot_warm = w[2 * h // 3 :].mean()
    top_warm = w[: h // 3].mean()
    return (top - bot) + 0.25 * (bot_warm - top_warm)


def orient_wall(im: Image.Image) -> Image.Image:
    best_im = im
    best = -1e9
    cur = im
    for _ in range(4):
        s = floor_at_bottom_score(cur)
        if s > best:
            best = s
            best_im = cur
        cur = cur.transpose(Image.Transpose.ROTATE_90)
    return best_im


def ceiling_color(im: Image.Image) -> tuple[int, int, int]:
    a = np.asarray(im, dtype=np.int32)
    band = a[: max(8, a.shape[0] // 8)]
    c = band.mean(axis=(0, 1))
    return int(c[0]), int(c[1]), int(c[2])


def floor_color(im: Image.Image) -> tuple[int, int, int]:
    a = np.asarray(im, dtype=np.int32)
    band = a[a.shape[0] * 7 // 8 :]
    c = band.mean(axis=(0, 1))
    return int(c[0]), int(c[1]), int(c[2])


def make_zenith(pz: Image.Image, outdoor: bool) -> Image.Image:
    """Looking straight up. Built from this room's own front photo, not another room."""
    w, h = pz.size
    s = int(w * 0.62)
    left = (w - s) // 2
    crop = pz.crop((left, 0, left + s, s)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    fill = Image.new("RGB", (SIZE, SIZE), ceiling_color(pz))
    # Soft center of the actual ceiling, edges fade to plaster/sky so cube seams don't scream.
    mask = Image.new("L", (SIZE, SIZE), 0)
    yy, xx = np.ogrid[:SIZE, :SIZE]
    r = np.sqrt((xx - SIZE / 2) ** 2 + (yy - SIZE / 2) ** 2)
    m = np.clip(1.15 - r / (SIZE * 0.52), 0, 1)
    mask = Image.fromarray((m * 255).astype(np.uint8), "L")
    out = Image.composite(crop, fill, mask)
    if outdoor:
        # Sky should stay sky-bright; no extra 180 — GL +Y top is already -Z (front wall).
        return out.filter(ImageFilter.GaussianBlur(radius=0.6))
    return out


def make_nadir(pz: Image.Image) -> Image.Image:
    """Looking straight down at this room's floor."""
    w, h = pz.size
    s = int(w * 0.62)
    left = (w - s) // 2
    crop = pz.crop((left, h - s, left + s, h)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    fill = Image.new("RGB", (SIZE, SIZE), floor_color(pz))
    yy, xx = np.ogrid[:SIZE, :SIZE]
    r = np.sqrt((xx - SIZE / 2) ** 2 + (yy - SIZE / 2) ** 2)
    m = np.clip(1.15 - r / (SIZE * 0.52), 0, 1)
    mask = Image.fromarray((m * 255).astype(np.uint8), "L")
    return Image.composite(crop, fill, mask)


def save(im: Image.Image, dest: Path) -> None:
    im = im.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=88, optimize=True)


def fix_room(name: str) -> None:
    folder = PANO / name
    pz = load(folder / "pz.jpg")
    outdoor = name in OUTDOOR

    save(orient_wall(pz), folder / "pz.jpg")
    pz = load(folder / "pz.jpg")

    for face in ("px", "nx", "nz"):
        im = load(folder / f"{face}.jpg")
        save(orient_wall(im), folder / f"{face}.jpg")

    save(make_zenith(pz, outdoor), folder / "py.jpg")
    save(make_nadir(pz), folder / "ny.jpg")
    print(f"fixed {name}")


def main() -> None:
    for name in ROOMS:
        if (PANO / name / "pz.jpg").exists():
            fix_room(name)


if __name__ == "__main__":
    main()
