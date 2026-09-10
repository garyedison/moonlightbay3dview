#!/usr/bin/env python3
"""Copy six distinct wall photos per room. No stitch, no blend."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ART = Path("/workspace/artifacts/imagine_images")
PUB = Path("/workspace/public")
OUT = PUB / "pano"
SIZE = 1024


def save_sq(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    im.resize((SIZE, SIZE), Image.Resampling.LANCZOS).save(dest, "JPEG", quality=88, optimize=True)


# pz front, px right, nx left, nz back, py up, ny down
ROOMS = {
    "bed1": {
        "pz": PUB / "villa/bedroom-canal.jpg",  # complete bed
        "px": ART / "fe207ba6-ab3c-4bb6-b416-6f4dae701386.jpg",  # nightstand
        "nx": ART / "492726d7-f6f3-4f82-987f-d94bbe535fc2.jpg",  # window / canal
        "nz": ART / "a9ccd7de-f906-43c5-be6f-5513df0d5db4.jpg",  # closet
        "py": ART / "00d833d0-cea3-4cc6-aa39-8fbc2616a7a8.jpg",
        "ny": ART / "5839894d-6fef-428c-970b-b0471a46c492.jpg",
    },
    "bed2": {
        "pz": PUB / "villa/bedroom-guest.jpg",
        "px": ART / "becf0e3b-92d9-4592-afbd-2e9da61e47a0.jpg",
        "nx": ART / "7de2ce4e-6233-4e02-a29a-2854f20a2233.jpg",
        "nz": ART / "afba73ba-358d-482c-8328-052fb8d03eb6.jpg",
        "py": ART / "00d833d0-cea3-4cc6-aa39-8fbc2616a7a8.jpg",
        "ny": ART / "5839894d-6fef-428c-970b-b0471a46c492.jpg",
    },
    "kitchen": {
        "pz": PUB / "villa/kitchen.jpg",  # range
        "px": ART / "194c4a9a-83f9-4418-9937-d49ca9ee8584.jpg",  # window
        "nx": ART / "12f13a4f-686e-4a53-97f1-20392e2e9ef5.jpg",  # island
        "nz": ART / "11691568-33e6-4263-b1d2-abc36358548f.jpg",  # living opening
        "py": ART / "71c68b6a-ae7f-4bbe-821d-7f2e173a0ad8.jpg",
        "ny": ART / "136639e8-a5d2-4899-bfe5-905061259cf4.jpg",
    },
    "living": {
        "pz": PUB / "villa/living.jpg",  # sofa
        "px": ART / "e311d0af-e60a-4b1d-88a5-9eef252c90d2.jpg",  # canal glass
        "nx": ART / "d2cff7b9-d36a-4450-b6cc-9c9bc180be29.jpg",  # dining table
        "nz": ART / "8a79cf16-289c-429b-bdba-b851d42c6f58.jpg",  # kitchen opening
        "py": ART / "3385073b-50e7-4a22-8f76-095d08dcff6e.jpg",
        "ny": ART / "5fed23ca-c45b-4974-bdf7-37185f9dc48a.jpg",
    },
    "bath": {
        "pz": PUB / "villa/bath.jpg",  # vanity
        "px": ART / "526e722b-5d5b-4b0e-b30f-40058e1e4bc2.jpg",  # shower
        "nx": ART / "d066ba1f-67e7-4c85-96a4-bd5d1492c6fb.jpg",  # linen
        "nz": ART / "dd3dec9b-79b7-4205-8825-ad916c26e41a.jpg",  # door
        "py": ART / "5e9023d5-19ce-4eea-afde-93f1f0d96009.jpg",
        "ny": ART / "09c9c3d6-78e6-4443-bc64-bf1a0383f3d9.jpg",
    },
    "dining": {
        "pz": PUB / "villa/dining.jpg",  # table
        "px": ART / "99fd0019-da6f-48c4-9913-a5b83346363b.jpg",  # canal glass
        "nx": ART / "d1d89ced-e1e8-4255-9fbc-9a08c75ae5ba.jpg",  # kitchen pass
        "nz": ART / "519f7704-054a-4c1a-b9d7-735d44cd9f28.jpg",  # sofa
        "py": ART / "3385073b-50e7-4a22-8f76-095d08dcff6e.jpg",
        "ny": ART / "5fed23ca-c45b-4974-bdf7-37185f9dc48a.jpg",
    },
    "cottage": {
        "pz": PUB / "cottage/interior.jpg",
        "px": ART / "e311d0af-e60a-4b1d-88a5-9eef252c90d2.jpg",
        "nx": ART / "d2cff7b9-d36a-4450-b6cc-9c9bc180be29.jpg",
        "nz": ART / "8a79cf16-289c-429b-bdba-b851d42c6f58.jpg",
        "py": ART / "3385073b-50e7-4a22-8f76-095d08dcff6e.jpg",
        "ny": ART / "5fed23ca-c45b-4974-bdf7-37185f9dc48a.jpg",
    },
    "stair": {
        "pz": PUB / "villa/stair.jpg",
        "px": ART / "8a79cf16-289c-429b-bdba-b851d42c6f58.jpg",
        "nx": ART / "e311d0af-e60a-4b1d-88a5-9eef252c90d2.jpg",
        "nz": PUB / "villa/living.jpg",
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
    "balcony": "deck-canal",
    "ext-canal": "deck-canal",
    "ext-gate": "deck-canal",
    "ext-beach": "deck-beach",
}


def main() -> None:
    for name, faces in ROOMS.items():
        for face, src in faces.items():
            save_sq(src, OUT / name / f"{face}.jpg")
        print("walls", name)
    for alias, src in ALIASES.items():
        for face in ("px", "nx", "py", "ny", "pz", "nz"):
            save_sq(OUT / src / f"{face}.jpg", OUT / alias / f"{face}.jpg")
        print("alias", alias)


if __name__ == "__main__":
    main()
