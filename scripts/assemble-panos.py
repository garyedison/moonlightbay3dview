#!/usr/bin/env python3
"""Build room-only cubemap faces. Kitchen faces are this kitchen — never other houses."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ART = Path("/workspace/artifacts/imagine_images")
PUB = Path("/workspace/public")
OUT = PUB / "pano"
SIZE = 1024


def square_crop(im: Image.Image) -> Image.Image:
    w, h = im.size
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    return im.crop((left, top, left + s, top + s)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def save_sq(src: Path, dest: Path, flip: bool = False) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    im = square_crop(im)
    if flip:
        im = im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    im.save(dest, "JPEG", quality=88, optimize=True)


def copy_art(name: str, dest: Path, flip: bool = False) -> None:
    save_sq(ART / name, dest, flip=flip)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    kit_up = "76002577-0ed6-4a86-8b19-c229f2b79e41.jpg"
    kit_dn = "8d0e8bac-d7a9-43dd-82d9-952da160798f.jpg"
    live_up = "97eff14d-14f1-4a7f-8837-95920e514a8d.jpg"
    live_dn = "407f7803-c7d9-4c39-b02f-bf08f48c556e.jpg"
    sky = "3ef8f012-6255-44f8-ace2-f9cbdce2f420.jpg"
    sand = kit_dn

    rooms = {
        "kitchen": {
            "pz": ("file", PUB / "villa/kitchen.jpg"),
            "px": ("art", "74fe0d1c-e2bf-467a-8356-08cb7a1a02ac.jpg"),
            "nx": ("art", "efdfb0d3-4489-4c33-9ca3-730a725a0562.jpg"),
            "nz": ("art", "a5eec384-aea1-44dc-8bd2-5624705c547f.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "living": {
            "pz": ("file", PUB / "villa/living.jpg"),
            "px": ("art", "ebeb3573-efad-4ebb-aff5-c7099edcb2b6.jpg"),
            "nx": ("art", "11449189-1462-4d26-bcd3-5edb5622d77a.jpg"),
            "nz": ("art", "286e2659-b515-4fd5-a2e6-e9db381a0f3b.jpg"),
            "py": ("art", live_up),
            "ny": ("art", live_dn),
        },
        "bed1": {
            "pz": ("file", PUB / "villa/bedroom-canal.jpg"),
            "px": ("art", "0ee26e71-7f53-48af-b956-301b9e08eebb.jpg"),
            "nx": ("art", "2f695f82-af09-46fb-a90b-e4a896e50484.jpg"),
            "nz": ("art", "3ce4be1c-9b11-4d5d-920c-2dae613f28db.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "bed2": {
            "pz": ("file", PUB / "villa/bedroom-guest.jpg"),
            "px": ("art", "d2158fa0-b60c-4a67-8bbb-69da095c2c47.jpg"),
            "nx": ("art", "d2158fa0-b60c-4a67-8bbb-69da095c2c47.jpg", True),
            "nz": ("art", "1955bb17-696e-424b-86e1-84ef46eec87e.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "bath": {
            "pz": ("file", PUB / "villa/bath.jpg"),
            "px": ("art", "bea8f22b-d3e8-49fe-acf0-92c9412495b5.jpg"),
            "nx": ("art", "2675f44c-db70-41fa-87e2-346c212d7620.jpg"),
            "nz": ("art", "681a91cb-64d7-4872-b1db-416b8880776b.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "dining": {
            "pz": ("file", PUB / "villa/dining.jpg"),
            "px": ("art", "2d8f22e5-89cf-4674-b314-7ff4abbf10a1.jpg"),
            "nx": ("art", "2d8f22e5-89cf-4674-b314-7ff4abbf10a1.jpg", True),
            "nz": ("art", "b74be16f-8425-452f-8078-390583992ca7.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "cottage": {
            "pz": ("file", PUB / "cottage/interior.jpg"),
            "px": ("art", "ebeb3573-efad-4ebb-aff5-c7099edcb2b6.jpg"),
            "nx": ("art", "11449189-1462-4d26-bcd3-5edb5622d77a.jpg"),
            "nz": ("art", "286e2659-b515-4fd5-a2e6-e9db381a0f3b.jpg"),
            "py": ("art", live_up),
            "ny": ("art", live_dn),
        },
        "stair": {
            "pz": ("file", PUB / "villa/stair.jpg"),
            "px": ("art", "11449189-1462-4d26-bcd3-5edb5622d77a.jpg"),
            "nx": ("art", "ebeb3573-efad-4ebb-aff5-c7099edcb2b6.jpg"),
            "nz": ("art", "286e2659-b515-4fd5-a2e6-e9db381a0f3b.jpg"),
            "py": ("art", kit_up),
            "ny": ("art", kit_dn),
        },
        "deck-canal": {
            "pz": ("art", "47d93e4e-b524-4080-a177-9ca5d2841e1f.jpg"),
            "px": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg"),
            "nx": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg", True),
            "nz": ("art", "15f04e20-cf53-4e1e-8ad7-563422ac146c.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
        "deck-beach": {
            "pz": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
            "px": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
            "nx": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg", True),
            "nz": ("art", "f64aa6b0-6334-4653-b5f7-3b45dd3e6741.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
        "balcony": {
            "pz": ("file", PUB / "villa/balcony.jpg"),
            "px": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
            "nx": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg", True),
            "nz": ("art", "f64aa6b0-6334-4653-b5f7-3b45dd3e6741.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
        "ext-canal": {
            "pz": ("art", "47d93e4e-b524-4080-a177-9ca5d2841e1f.jpg"),
            "px": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg"),
            "nx": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg", True),
            "nz": ("art", "15f04e20-cf53-4e1e-8ad7-563422ac146c.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
        "ext-beach": {
            "pz": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
            "px": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
            "nx": ("art", "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg", True),
            "nz": ("art", "f64aa6b0-6334-4653-b5f7-3b45dd3e6741.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
        "ext-gate": {
            "pz": ("file", PUB / "cottage/e1.jpg"),
            "px": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg"),
            "nx": ("art", "ce093b23-4293-4249-878c-a31bd8a6be29.jpg", True),
            "nz": ("art", "15f04e20-cf53-4e1e-8ad7-563422ac146c.jpg"),
            "py": ("art", sky),
            "ny": ("art", sand),
        },
    }

    for room, faces in rooms.items():
        for face, spec in faces.items():
            dest = OUT / room / f"{face}.jpg"
            kind = spec[0]
            src = spec[1]
            flip = spec[2] if len(spec) > 2 else False
            if kind == "file":
                save_sq(Path(src), dest, flip=flip)
            else:
                copy_art(str(src), dest, flip=flip)
            print(f"wrote {dest}")

    shutil.copyfile(ART / "6aecd1d3-05fe-4b69-9f14-29102977e683.jpg", OUT / "skin-teal.jpg")
    shutil.copyfile(ART / "99739763-91c7-4e49-a2db-54d8ba0c4e84.jpg", OUT / "skin-charcoal.jpg")
    shutil.copyfile(ART / "3aeaa602-9479-4a81-9adc-dd427b46a602.jpg", OUT / "skin-steel.jpg")
    shutil.copyfile(ART / "814ffa35-971c-4108-bdb2-43e330583674.jpg", OUT / "skin-wood.jpg")

    for name, src in [
        ("villa/beach-walk.jpg", ART / "1ce38855-de40-4e40-adcc-4541ac5c3d48.jpg"),
        ("villa/canal-walk.jpg", ART / "47d93e4e-b524-4080-a177-9ca5d2841e1f.jpg"),
        ("villa/canal-house.jpg", ART / "15f04e20-cf53-4e1e-8ad7-563422ac146c.jpg"),
        ("villa/canal-bank.jpg", ART / "ce093b23-4293-4249-878c-a31bd8a6be29.jpg"),
        ("villa/beach-cottage.jpg", ART / "f64aa6b0-6334-4653-b5f7-3b45dd3e6741.jpg"),
    ]:
        shutil.copyfile(src, PUB / name)
        print(f"copied {name}")

    print("done", len(list(OUT.rglob("*.jpg"))), "pano files")


if __name__ == "__main__":
    main()
