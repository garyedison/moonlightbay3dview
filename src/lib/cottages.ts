export type CottageId = "e1" | "e2" | "e3" | "e4" | "e5" | "e6" | "e7";
export type LaneId = "villas" | "gate" | "value";

export type Cottage = {
  id: CottageId;
  code: string;
  name: string;
  beds: string;
  area: string;
  areaM2: number;
  shellUsd: number;
  load: string;
  accent: string;
  cladding: string;
  deck: string;
  image: string;
  canalImage: string;
  blurb: string;
  stays: string;
};

export type Place = {
  lot: number;
  cottageId: CottageId;
  furnished: number;
};

export const PRICE = {
  min: 180_000,
  max: 250_000,
  label: "$180k – $250k furnished",
};

export const GATE = {
  title: "Gate row",
  kicker: "Lots 330 · 315 · 314 · 169 · 168 · 167 · 165",
  note: "Moderate-price cottages on quarter-acre lots just inside the gate. The entrance sits beside the first house. One road runs past a mix of models — not a clone street. Planted like Consejo: coconut and chit palm, sea grape and cocoplum. Furnished $180k to $250k.",
  walk: "≈ 20 min walk / 5 min golf cart to the beach",
  lot: "¼ acre · 70 × 150 ft",
};

export const VALUE = {
  title: "Canal, better price",
  kicker: "Lots 108 – 114 · inland canal · furthest from the ocean",
  note: "Seven quarter-acre lots on the far canal (108–114). Mixed small cottages. Each house sits on level land with a 400 sq ft teak deck at a 5 ft drop to the water. Lots 103–107 on the same canal use the middle 20 × 30 plans — see Lot catalog. Planted like Consejo. Furnished $180k to $250k.",
  deck: "400 sq ft canal deck · 5 ft drop to water",
  lot: "¼ acre · 70 × 150 ft",
};

export const COTTAGES: Cottage[] = [
  {
    id: "e1",
    code: "PT211222",
    name: "Pool bungalow",
    beds: "2 bed / 2 bath",
    area: "581 sf + porch",
    areaM2: 54,
    shellUsd: 23100,
    load: "2 per 40HQ",
    accent: "salt",
    cladding: "Salt-white siding, charcoal roof",
    deck: "Side porch and a small plunge pool",
    image: "/cottage/e1-k.jpg",
    canalImage: "/cottage/c-e1-k.jpg",
    blurb: "The family house. Two bedrooms, two baths, a tiny pool. Strongest annual for a US couple with a guest.",
    stays: "Nightly · monthly · annual",
  },
  {
    id: "e2",
    code: "PT230206",
    name: "Cedar lodge",
    beds: "2 bed / 1 bath",
    area: "581 sf + porch",
    areaM2: 54,
    shellUsd: 23500,
    load: "1.82 per 40HQ",
    accent: "teak",
    cladding: "Oiled teak boards, charcoal frames",
    deck: "Deep covered porch",
    image: "/cottage/e2-k.jpg",
    canalImage: "/cottage/c-e2-k.jpg",
    blurb: "Dark wood and a deep porch. Reads as a cabin, lives as a two-bedroom with the villa sofa and rattan.",
    stays: "Monthly · annual",
  },
  {
    id: "e3",
    code: "PT220325",
    name: "Porch cottage",
    beds: "2 bed / 1 bath",
    area: "472 sf incl. terrace",
    areaM2: 43.9,
    shellUsd: 12750,
    load: "2.5 per 40HQ",
    accent: "glass",
    cladding: "Salt-white, sea-glass door",
    deck: "Full-width front terrace",
    image: "/cottage/e3-k.jpg",
    canalImage: "/cottage/c-e3-k.jpg",
    blurb: "The entry two-bed. A wide terrace is the living room. Strong Airbnb — the porch photographs.",
    stays: "Nightly · monthly",
  },
  {
    id: "e4",
    code: "PT220145",
    name: "Loft cabin",
    beds: "1 bed + loft",
    area: "312 sf × 2 levels",
    areaM2: 29,
    shellUsd: 12850,
    load: "3 per 40HQ",
    accent: "glass",
    cladding: "Sea-glass sage, charcoal stair",
    deck: "Roof terrace",
    image: "/cottage/e4-k.jpg",
    canalImage: "/cottage/c-e4-k.jpg",
    blurb: "A cube with a roof deck. One bedroom down, loft up. For a remote worker who wants height.",
    stays: "Monthly · annual",
  },
  {
    id: "e5",
    code: "PT220348-1",
    name: "Studio deck",
    beds: "Studio / 1 bath",
    area: "312 sf + wrap deck",
    areaM2: 29,
    shellUsd: 15850,
    load: "3 per 40HQ",
    accent: "teak",
    cladding: "Teak, glass-rail deck",
    deck: "Wrap deck on three sides",
    image: "/cottage/e5-k.jpg",
    canalImage: "/cottage/c-e5-k.jpg",
    blurb: "The smallest footprint. Almost all glass. Same rattan and linen as the villas.",
    stays: "Nightly · monthly",
  },
  {
    id: "e6",
    code: "PT220348-2",
    name: "Linear two-bed",
    beds: "2 bed / 1 bath",
    area: "635 sf",
    areaM2: 59,
    shellUsd: 18250,
    load: "2 per 40HQ",
    accent: "teak",
    cladding: "Teak bar, a wall of glass",
    deck: "Flush glass to the garden",
    image: "/cottage/e6-k.jpg",
    canalImage: "/cottage/c-e6-k.jpg",
    blurb: "Largest interior of the seven. Two bedrooms in a line, living in the middle. Best year-lease.",
    stays: "Monthly · annual",
  },
  {
    id: "e7",
    code: "PT220348-3",
    name: "L-wrap",
    beds: "2 bed / 1 bath",
    area: "472 sf + L-deck",
    areaM2: 43.9,
    shellUsd: 20650,
    load: "2 per 40HQ",
    accent: "lagoon",
    cladding: "Teak L-plan, lagoon cushions",
    deck: "L-shaped glass-rail deck",
    image: "/cottage/e7-k.jpg",
    canalImage: "/cottage/c-e7-k.jpg",
    blurb: "Two bedrooms and a courtyard deck. A little more privacy from the road.",
    stays: "Nightly · monthly · annual",
  },
];

/** Gate lots in road order — first house beside the gate. */
export const GATE_PLACES: Place[] = [
  { lot: 330, cottageId: "e1", furnished: 248000 },
  { lot: 315, cottageId: "e4", furnished: 192000 },
  { lot: 314, cottageId: "e2", furnished: 232000 },
  { lot: 169, cottageId: "e6", furnished: 238000 },
  { lot: 168, cottageId: "e3", furnished: 188000 },
  { lot: 167, cottageId: "e5", furnished: 180000 },
  { lot: 165, cottageId: "e7", furnished: 226000 },
];

/** Inland canal lots 108–114, mixed small cottages. 103–107 are middle plans in the lot catalog. */
export const VALUE_PLACES: Place[] = [
  { lot: 108, cottageId: "e7", furnished: 226000 },
  { lot: 109, cottageId: "e4", furnished: 192000 },
  { lot: 110, cottageId: "e6", furnished: 238000 },
  { lot: 111, cottageId: "e2", furnished: 232000 },
  { lot: 112, cottageId: "e1", furnished: 248000 },
  { lot: 113, cottageId: "e5", furnished: 180000 },
  { lot: 114, cottageId: "e3", furnished: 188000 },
];

export const COTTAGE_KIT = [
  { item: "Sand linen sofa or daybed", note: "Same slipcover SKU as the villas" },
  { item: "Rattan lounge chairs", note: "One pair per cottage" },
  { item: "Teak dining table + chairs", note: "Indoor/outdoor, one finish" },
  { item: "Ivory linen bedding", note: "Sized to the plan, same mill" },
  { item: "Seagrass rug, woven pendant", note: "The villa lighting family" },
  { item: "Teak wet-pack + matte black tap", note: "Kitchen and bath, factory-fitted" },
];

export const COTTAGE_MEP = [
  "One electrical panel type, one water heater type, one mini-split family",
  "Wet rooms back-to-back so a single plumber kit covers the row",
  "Septic per lot; water and power from the road",
  "Lighting, fans, and receptacles pulled from the villa schedule",
];

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function cottageById(id: CottageId) {
  return COTTAGES.find((c) => c.id === id) ?? COTTAGES[0];
}

export function resolvePlace(place: Place) {
  return { ...place, cottage: cottageById(place.cottageId) };
}
