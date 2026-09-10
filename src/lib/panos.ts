import type { PlanRoom, Zone } from "./community";
import { tourFor } from "./tours";

/** Six-face cubemap folders under /pano/<key>/{px,nx,py,ny,pz,nz}.jpg */
export type PanoKey =
  | "living"
  | "kitchen"
  | "bed1"
  | "bed2"
  | "bath"
  | "dining"
  | "deck-canal"
  | "deck-beach"
  | "cottage"
  | "stair"
  | "balcony"
  | "ext-canal"
  | "ext-beach"
  | "ext-gate";

export type PanoRoom = PlanRoom & { pano: PanoKey; thumb: string };

const FACES = ["px", "nx", "py", "ny", "pz", "nz"] as const;

export function panoUrls(key: PanoKey): string[] {
  return FACES.map((f) => `/pano/${key}/${f}.jpg`);
}

export function panoKeyFor(roomId: string, zone: Zone, archId: string): PanoKey {
  if (roomId === "outside" || roomId === "ext") {
    if (zone === "beach") return "ext-beach";
    if (zone === "gate") return "ext-gate";
    return "ext-canal";
  }
  if (roomId === "deck") return zone === "beach" ? "deck-beach" : "deck-canal";
  if (roomId === "kitchen") return "kitchen";
  if (roomId === "dining") return "dining";
  if (roomId === "bath") return "bath";
  if (roomId === "bed1") return "bed1";
  if (roomId === "bed2" || roomId === "bed3") return "bed2";
  if (roomId === "stair") return "stair";
  if (roomId === "balcony") return "balcony";
  if (roomId === "living" || roomId === "studio") {
    if (archId === "wood-small" || archId === "wood-studio" || archId === "steel-cube") return "cottage";
    return "living";
  }
  return "living";
}

function virtual(id: string, name: string, pano: PanoKey, thumb: string): PanoRoom {
  return {
    id,
    name,
    x: 0,
    z: 0,
    w: 4,
    d: 4,
    floor: 1,
    kind: "live",
    pano,
    thumb,
  };
}

export function panoRooms(archId: string, zone: Zone): PanoRoom[] {
  const ext: PanoKey = zone === "beach" ? "ext-beach" : zone === "gate" ? "ext-gate" : "ext-canal";
  const deck: PanoKey = zone === "beach" ? "deck-beach" : "deck-canal";
  const out: PanoRoom[] = [
    virtual("kitchen", "Kitchen", "kitchen", "/villa/kitchen.jpg"),
    virtual("living", "Living", panoKeyFor("living", zone, archId), "/villa/living.jpg"),
    virtual("deck", zone === "beach" ? "Beach terrace" : "Canal deck", deck, `/pano/${deck}/pz.jpg`),
    virtual("outside", "Outside 360", ext, `/pano/${ext}/pz.jpg`),
  ];
  const tour = tourFor(archId, zone);
  const seen = new Set(out.map((r) => r.id));
  for (const t of tour) {
    if (seen.has(t.id)) continue;
    const key = panoKeyFor(t.id, zone, archId);
    out.push(virtual(t.id, t.name, key, t.image));
    seen.add(t.id);
  }
  return out;
}
