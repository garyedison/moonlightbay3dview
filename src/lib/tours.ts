import type { Zone } from "./community";

/** Photoreal room from the factory furniture set. Same kitchen / living / bed SKUs across models. */
export type TourRoom = {
  id: string;
  name: string;
  image: string;
  caption: string;
};

const LIVING: TourRoom = {
  id: "living",
  name: "Living",
  image: "/villa/living.jpg",
  caption: "Sand linen sofa and rattan chairs face the glass. Same Caribbean Salt kit in every house.",
};
const LIVING_BEACH: TourRoom = {
  id: "living",
  name: "Living",
  image: "/villa/beach-living.jpg",
  caption: "The sliders open onto the teak terrace. Living room and outdoor dining are one suite.",
};
const KITCHEN: TourRoom = {
  id: "kitchen",
  name: "Kitchen",
  image: "/villa/kitchen.jpg",
  caption: "Teak cabinets, limestone, sea-glass tile. Factory-fitted wet pack — one SKU for every lot.",
};
const DINING: TourRoom = {
  id: "dining",
  name: "Dining",
  image: "/villa/dining.jpg",
  caption: "Teak table and rattan chairs. On a canal lot this room looks toward the water.",
};
const PRIMARY_CANAL: TourRoom = {
  id: "bed1",
  name: "Primary",
  image: "/villa/bedroom-canal.jpg",
  caption: "Primary bedroom. Linen, teak, and the same lagoon textiles as the villas.",
};
const PRIMARY_BEACH: TourRoom = {
  id: "bed1",
  name: "Primary",
  image: "/villa/bedroom-beach.jpg",
  caption: "Primary on the bay side. Same bed and linens as the canal houses — bulk FF&E.",
};
const GUEST: TourRoom = {
  id: "bed2",
  name: "Bedroom 2",
  image: "/villa/bedroom-guest.jpg",
  caption: "Guest room in salt limewash and linen. Same furniture family as the primary.",
};
const BATH: TourRoom = {
  id: "bath",
  name: "Bath",
  image: "/villa/bath.jpg",
  caption: "Honed limestone and teak. The wet-room pack is identical across the community.",
};
const DECK_CANAL: TourRoom = {
  id: "deck",
  name: "Canal deck",
  image: "/villa/canal-walk.jpg",
  caption: "Teak deck at the top of the 5-foot bank. House on dry land; the canal snakes through mangrove.",
};
const DECK_BEACH: TourRoom = {
  id: "deck",
  name: "Beach terrace",
  image: "/villa/beach-walk.jpg",
  caption: "Sandy Chetumal Bay terrace. Mixed cottages and containers sit back from the water.",
};
const COTTAGE_LIVE: TourRoom = {
  id: "living",
  name: "Living",
  image: "/cottage/interior.jpg",
  caption: "High-end furniture in the smaller cottages — same salt / teak / rattan kit, scaled.",
};
const BALCONY: TourRoom = {
  id: "balcony",
  name: "Balcony",
  image: "/villa/balcony.jpg",
  caption: "Upper outdoor room. Used on the two-story steel villas.",
};
const STAIR: TourRoom = {
  id: "stair",
  name: "Stair",
  image: "/villa/stair.jpg",
  caption: "Oiled teak stair between the two container levels.",
};

const BY_ARCH: Record<string, TourRoom[]> = {
  "steel-villa": [LIVING, KITCHEN, PRIMARY_CANAL, GUEST, BATH, BALCONY, STAIR, DECK_CANAL],
  "steel-linear": [LIVING, KITCHEN, PRIMARY_CANAL, BATH, DECK_CANAL],
  "steel-cube": [COTTAGE_LIVE, BATH, PRIMARY_CANAL, BALCONY],
  "wood-bay": [LIVING, KITCHEN, DINING, PRIMARY_BEACH, GUEST, BATH, DECK_BEACH],
  "wood-mid": [LIVING, KITCHEN, PRIMARY_CANAL, GUEST, BATH, DECK_CANAL],
  "wood-park": [LIVING, KITCHEN, PRIMARY_CANAL, GUEST, BATH],
  "wood-small": [COTTAGE_LIVE, KITCHEN, PRIMARY_CANAL, BATH],
  "wood-studio": [COTTAGE_LIVE, BATH, DECK_CANAL],
};

const EXTERIOR_BY_ARCH: Record<string, string> = {
  "steel-villa": "/villa/exterior-hero.jpg",
  "steel-linear": "/cottage/c-e2.jpg",
  "steel-cube": "/cottage/e5.jpg",
  "wood-bay": "/cottage/nb-196.jpg",
  "wood-mid": "/cottage/nb-103.jpg",
  "wood-park": "/cottage/nb-234.jpg",
  "wood-small": "/cottage/e1.jpg",
  "wood-studio": "/cottage/e7.jpg",
};

/** Unique exterior stills for ~30% of lots (featured + cycled cottage/villa shots). */
const EXTERIOR_BY_LOT: Record<number, string> = {
  196: "/villa/beach-cottage.jpg",
  197: "/villa/beach-walk.jpg",
  198: "/villa/beach-cottage.jpg",
  199: "/villa/beach-walk.jpg",
  200: "/villa/beach-hero.jpg",
  201: "/villa/beach-dusk.jpg",
  202: "/villa/beach-walk.jpg",
  203: "/villa/beach-balcony.jpg",
  103: "/villa/canal-walk.jpg",
  104: "/villa/canal-house.jpg",
  105: "/villa/canal-bank.jpg",
  106: "/villa/canal-walk.jpg",
  107: "/villa/canal-house.jpg",
  108: "/cottage/c-e1.jpg",
  109: "/cottage/c-e2.jpg",
  110: "/cottage/c-e3.jpg",
  111: "/cottage/c-e4.jpg",
  112: "/cottage/c-e5.jpg",
  113: "/cottage/c-e6.jpg",
  114: "/cottage/c-e7.jpg",
  207: "/villa/canal-hero.jpg",
  208: "/villa/canal-dusk.jpg",
  209: "/cottage/canal-true.jpg",
  210: "/cottage/c-e1.jpg",
  211: "/cottage/c-e3.jpg",
  212: "/cottage/nb-105.jpg",
  330: "/cottage/e1.jpg",
  315: "/cottage/e2.jpg",
  314: "/cottage/e3.jpg",
  169: "/cottage/e4.jpg",
  168: "/cottage/e5.jpg",
  167: "/cottage/e6.jpg",
  165: "/cottage/e7.jpg",
  234: "/cottage/nb-234.jpg",
  235: "/cottage/nb-235.jpg",
  236: "/cottage/nb-236.jpg",
  237: "/cottage/nb-237.jpg",
  238: "/cottage/nb-238.jpg",
  239: "/cottage/nb-239.jpg",
  241: "/cottage/nb-241.jpg",
  252: "/cottage/nb-252.jpg",
  253: "/cottage/nb-253.jpg",
  254: "/cottage/nb-254.jpg",
  255: "/cottage/nb-255.jpg",
  256: "/cottage/nb-256.jpg",
  257: "/cottage/nb-257.jpg",
  258: "/cottage/nb-258.jpg",
  259: "/cottage/nb-259.jpg",
};

const COTTAGE_CYCLE = [
  "/cottage/e1.jpg",
  "/cottage/e2.jpg",
  "/cottage/e3.jpg",
  "/cottage/e4.jpg",
  "/cottage/e5.jpg",
  "/cottage/e6.jpg",
  "/cottage/e7.jpg",
  "/cottage/c-e1.jpg",
  "/cottage/c-e2.jpg",
  "/cottage/c-e3.jpg",
  "/cottage/c-e4.jpg",
  "/cottage/c-e5.jpg",
  "/cottage/nb-103.jpg",
  "/cottage/nb-196.jpg",
  "/villa/exterior-hero.jpg",
  "/villa/canal-hero.jpg",
];

export function tourFor(archId: string, zone: Zone): TourRoom[] {
  const base = BY_ARCH[archId] ?? [LIVING, KITCHEN, PRIMARY_CANAL, BATH];
  if (zone === "beach") {
    return base.map((r) => {
      if (r.id === "living") return LIVING_BEACH;
      if (r.id === "bed1") return PRIMARY_BEACH;
      if (r.id === "deck") return DECK_BEACH;
      return r;
    });
  }
  return base;
}

export function exteriorFor(lotN: number, archId: string): string {
  if (EXTERIOR_BY_LOT[lotN]) return EXTERIOR_BY_LOT[lotN];
  if (lotN % 3 === 0) return COTTAGE_CYCLE[lotN % COTTAGE_CYCLE.length]!;
  return EXTERIOR_BY_ARCH[archId] ?? "/villa/exterior-hero.jpg";
}

export function hasUniqueExterior(lotN: number) {
  return lotN in EXTERIOR_BY_LOT || lotN % 3 === 0;
}


export function photoForRoom(roomId: string, archId: string, zone: Zone): string {
  const tour = tourFor(archId, zone);
  const hit = tour.find((t) => t.id === roomId);
  if (roomId === "outside" || roomId === "ext") {
    if (zone === "beach") return "/cottage/nb-196.jpg";
    if (zone === "gate") return "/cottage/e1.jpg";
    return "/cottage/nb-103.jpg";
  }
  if (hit) return hit.image;
  if (roomId.startsWith("bed")) return zone === "beach" ? PRIMARY_BEACH.image : PRIMARY_CANAL.image;
  if (roomId === "kitchen") return KITCHEN.image;
  if (roomId === "bath") return BATH.image;
  if (roomId === "deck") return zone === "beach" ? DECK_BEACH.image : DECK_CANAL.image;
  return zone === "beach" ? LIVING_BEACH.image : LIVING.image;
}

export function tourRoom(roomId: string, archId: string, zone: Zone): TourRoom | undefined {
  return tourFor(archId, zone).find((t) => t.id === roomId);
}

