#!/usr/bin/env python3
"""Stitch 6 same-spot views into one 2:1 equirectangular (horizon stays level)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ART = Path("/workspace/artifacts/imagine_images")
PUB = Path("/workspace/public")
OUT = PUB / "pano" / "eq"
FACE = 512
W, H = 2048, 1024


def sq(path: Path) -> np.ndarray:
    im = Image.open(path).convert("RGB")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    return np.asarray(im.resize((FACE, FACE), Image.Resampling.LANCZOS), dtype=np.float32)


def sample_face(face: np.ndarray, u: np.ndarray, v: np.ndarray) -> np.ndarray:
    """u,v in [-1,1], center of face is 0,0, +u right, +v up in the image... 
    Image y is down, so v_img = (1-v)/2."""
    x = np.clip((u + 1) * 0.5 * (FACE - 1), 0, FACE - 1)
    y = np.clip((1 - v) * 0.5 * (FACE - 1), 0, FACE - 1)
    x0 = np.floor(x).astype(np.int32)
    y0 = np.floor(y).astype(np.int32)
    x1 = np.clip(x0 + 1, 0, FACE - 1)
    y1 = np.clip(y0 + 1, 0, FACE - 1)
    tx = (x - x0)[..., None]
    ty = (y - y0)[..., None]
    c00 = face[y0, x0]
    c10 = face[y0, x1]
    c01 = face[y1, x0]
    c11 = face[y1, x1]
    return (c00 * (1 - tx) + c10 * tx) * (1 - ty) + (c01 * (1 - tx) + c11 * tx) * ty


def cubemap_to_equirect(px, nx, py, ny, pz, nz) -> Image.Image:
    """
    theta=0, phi=0 looks -Z (front = pz).
    +X right = px, -X left = nx, +Y up = py, -Y down = ny, +Z back = nz.
    """
    xs = (np.arange(W) + 0.5) / W
    ys = (np.arange(H) + 0.5) / H
    xx, yy = np.meshgrid(xs, ys)
    theta = (xx - 0.5) * 2 * np.pi
    phi = (0.5 - yy) * np.pi
    cp = np.cos(phi)
    dx = cp * np.sin(theta)
    dy = np.sin(phi)
    dz = -cp * np.cos(theta)
    absx, absy, absz = np.abs(dx), np.abs(dy), np.abs(dz)

    out = np.zeros((H, W, 3), dtype=np.float32)

    def put(mask, face, u, v):
        if not np.any(mask):
            return
        out[mask] = sample_face(face, u[mask], v[mask])

    m = (absx >= absy) & (absx >= absz) & (dx > 0)
    put(m, px, -dz / np.maximum(absx, 1e-6), dy / np.maximum(absx, 1e-6))
    m = (absx >= absy) & (absx >= absz) & (dx < 0)
    put(m, nx, dz / np.maximum(absx, 1e-6), dy / np.maximum(absx, 1e-6))
    m = (absy >= absx) & (absy >= absz) & (dy > 0)
    put(m, py, dx / np.maximum(absy, 1e-6), dz / np.maximum(absy, 1e-6))
    m = (absy >= absx) & (absy >= absz) & (dy < 0)
    put(m, ny, dx / np.maximum(absy, 1e-6), -dz / np.maximum(absy, 1e-6))
    m = (absz >= absx) & (absz >= absy) & (dz < 0)
    put(m, pz, dx / np.maximum(absz, 1e-6), dy / np.maximum(absz, 1e-6))
    m = (absz >= absx) & (absz >= absy) & (dz > 0)
    put(m, nz, -dx / np.maximum(absz, 1e-6), dy / np.maximum(absz, 1e-6))

    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


ROOMS = {
    "kitchen": {
        "pz": PUB / "villa/kitchen.jpg",
        "px": ART / "fdc89d65-1a2c-4e57-8a71-4347d701f099.jpg",
        "nx": ART / "f6ed335d-cca6-48c0-8594-114885dc124e.jpg",
        "nz": ART / "ef2c2be1-4097-4894-9f94-dd77129f678b.jpg",
        "py": ART / "71c68b6a-ae7f-4bbe-821d-7f2e173a0ad8.jpg",
        "ny": ART / "136639e8-a5d2-4899-bfe5-905061259cf4.jpg",
    },
    "living": {
        "pz": PUB / "villa/living.jpg",
        "px": ART / "443b057b-f534-4f24-976b-1e58c65edd40.jpg",
        "nx": ART / "c95779b1-d4a6-49e0-8108-8cd3d1c3fa96.jpg",
        "nz": ART / "294881f3-54ac-4639-9ec3-fc0026658738.jpg",
        "py": ART / "3385073b-50e7-4a22-8f76-095d08dcff6e.jpg",
        "ny": ART / "5fed23ca-c45b-4974-bdf7-37185f9dc48a.jpg",
    },
    "bed1": {
        "pz": PUB / "villa/bedroom-canal.jpg",
        "px": ART / "022dcbbd-7588-466d-88f9-28c7123c2bd3.jpg",
        "nx": ART / "f3ea3187-751c-4c62-a504-9742f3c47526.jpg",
        "nz": ART / "943603ed-9f80-409a-af47-a0d3fcc9b91d.jpg",
        "py": ART / "00d833d0-cea3-4cc6-aa39-8fbc2616a7a8.jpg",
        "ny": ART / "5839894d-6fef-428c-970b-b0471a46c492.jpg",
    },
    "bath": {
        "pz": PUB / "villa/bath.jpg",
        "px": ART / "d1ef6d63-ae0c-4021-8662-5a425b732c2a.jpg",
        "nx": ART / "297382f8-ef2a-406c-a300-b87bc1409b8a.jpg",
        "nz": ART / "f413e8c7-222e-44e7-9d37-f5a0f45e0d41.jpg",
        "py": ART / "5e9023d5-19ce-4eea-afde-93f1f0d96009.jpg",
        "ny": ART / "09c9c3d6-78e6-4443-bc64-bf1a0383f3d9.jpg",
    },
    "dining": {
        "pz": PUB / "villa/dining.jpg",
        "px": ART / "a9f22c09-3634-477b-a01d-f2b112104ca3.jpg",
        "nx": ART / "9f6c4100-59c1-4931-ae35-0c5d8e4eb15a.jpg",
        "nz": ART / "b5fe4fa0-acd4-456c-bf30-c3a75e99bda7.jpg",
        "py": ART / "3385073b-50e7-4a22-8f76-095d08dcff6e.jpg",
        "ny": ART / "5fed23ca-c45b-4974-bdf7-37185f9dc48a.jpg",
    },
    "deck-canal": {
        "pz": PUB / "villa/canal-house.jpg",
        "px": ART / "8d2a1e52-1308-4db3-96ea-fe8d970649d2.jpg",
        "nx": ART / "53ac8cf9-e727-4be3-99a1-81cdfbe4598a.jpg",
        "nz": ART / "c9c725d0-e84a-48ad-b748-2fad5564397f.jpg",
        "py": ART / "933a7f10-685b-4ec9-bd5f-6bd8daf58319.jpg",
        "ny": ART / "451bc8a3-bdf6-448b-a56c-0d13140b0fb7.jpg",
    },
    "deck-beach": {
        "pz": PUB / "villa/beach-deck.jpg",
        "px": ART / "2363b11d-e4c9-45b0-ac2c-8772e5fc8b50.jpg",
        "nx": ART / "45f81d91-59a1-4914-b4fe-4da42733db3a.jpg",
        "nz": ART / "a7a2b07e-48a2-4748-9de4-15f491315205.jpg",
        "py": ART / "933a7f10-685b-4ec9-bd5f-6bd8daf58319.jpg",
        "ny": ART / "451bc8a3-bdf6-448b-a56c-0d13140b0fb7.jpg",
    },
}

ALIASES = {
    "cottage": "living",
    "bed2": "bed1",
    "stair": "living",
    "balcony": "deck-canal",
    "ext-canal": "deck-canal",
    "ext-gate": "deck-canal",
    "ext-beach": "deck-beach",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, faces in ROOMS.items():
        eq = cubemap_to_equirect(
            sq(faces["px"]),
            sq(faces["nx"]),
            sq(faces["py"]),
            sq(faces["ny"]),
            sq(faces["pz"]),
            sq(faces["nz"]),
        )
        dest = OUT / f"{name}.jpg"
        eq.save(dest, "JPEG", quality=86, optimize=True)
        print("wrote", dest)
    for alias, src in ALIASES.items():
        src_path = OUT / f"{src}.jpg"
        dest = OUT / f"{alias}.jpg"
        if src_path.exists():
            Image.open(src_path).save(dest, "JPEG", quality=86, optimize=True)
            print("alias", alias, "->", src)


if __name__ == "__main__":
    main()
