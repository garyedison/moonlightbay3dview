import type { TourRoom } from "./tours";
import {
  HIP_STYLE,
  KITS,
  PRICE,
  SPIRAL_ROOF_FFE,
  SPIRAL_SITE,
  SPIRAL_SITE_TOTAL,
  SPIRAL_STYLE,
  allInOne,
  factoryOnSite,
  ffeFor,
  groupTotal,
  kitTotal,
  laborFor,
  shellSubtotal,
  siteworkFor,
  usd,
  type QuoteStyle,
} from "./quote";

export type PlanZone = {
  id: string;
  name: string;
  floor: 1 | 2 | "deck" | "lot";
  x: number;
  y: number;
  w: number;
  h: number;
  note: string;
};

/** Ground floor 16 × 32 ft. Canal to the west (top of the drawing). */
export const LOWER_ZONES: PlanZone[] = [
  { id: "deck", name: "400 sf teak deck", floor: "deck", x: 8, y: 8, w: 304, h: 52, note: "Open wood. Two steps. Faces the canal." },
  { id: "living", name: "Living / dining", floor: 1, x: 24, y: 68, w: 168, h: 140, note: "16 × 16 ft. Full-height sliders to the canal." },
  { id: "kitchen", name: "Kitchen", floor: 1, x: 192, y: 68, w: 104, h: 88, note: "8 × 10 ft galley. Factory teak wet pack." },
  { id: "bath", name: "Bath 1", floor: 1, x: 192, y: 156, w: 64, h: 52, note: "6 × 8 ft. Downstairs wet room." },
  { id: "bed2", name: "Bedroom 2", floor: 1, x: 24, y: 208, w: 148, h: 100, note: "10 × 12 ft guest. Garden window." },
  { id: "spiral", name: "Spiral", floor: 1, x: 180, y: 216, w: 116, h: 84, note: "5 ft black steel stair on the rust end." },
];

/** Upper 16 × 16 ft over the inland half. Roof deck over living. */
export const UPPER_ZONES: PlanZone[] = [
  { id: "roof", name: "Roof deck", floor: 2, x: 24, y: 68, w: 168, h: 140, note: "16 × 16 ft cable rail over the living room." },
  { id: "bed1", name: "Primary", floor: 2, x: 24, y: 216, w: 168, h: 92, note: "12 × 11 ft. Balcony to the canal." },
  { id: "bath2", name: "Bath 2", floor: 2, x: 192, y: 216, w: 104, h: 92, note: "6 × 8 ft upstairs wet pack." },
];

export const SPIRAL_TOUR: TourRoom[] = [
  { id: "living", name: "Living", image: "/quote/spiral/living.jpg", caption: "Sand linen sofa facing the sliders. Canal light, same Caribbean Salt kit." },
  { id: "kitchen", name: "Kitchen", image: "/quote/spiral/kitchen.jpg", caption: "Teak millwork, limestone, sea-glass tile — factory wet pack." },
  { id: "bed1", name: "Primary · up", image: "/quote/spiral/bed1.jpg", caption: "Upstairs primary. Ivory linen, rattan headboard, balcony to the canal." },
  { id: "bed2", name: "Bedroom 2 · down", image: "/quote/spiral/bed2.jpg", caption: "Downstairs guest. Same furniture family as the primary." },
  { id: "bath", name: "Bath 1 · down", image: "/quote/spiral/bath.jpg", caption: "Honed limestone and teak. Downstairs wet room." },
  { id: "bath2", name: "Bath 2 · up", image: "/quote/spiral/bath2.jpg", caption: "Same wet pack upstairs, window to the palms." },
  { id: "deck", name: "400 sf deck", image: "/quote/spiral/deck.jpg", caption: "Open teak platform on the canal bank. No mosquito screen." },
  { id: "roof", name: "Roof deck", image: "/quote/spiral/roof.jpg", caption: "Cable-rail roof deck. Two teak Adirondack chairs." },
];

export const SPIRAL_SPECS = [
  ["Beds / baths", "2 bed / 2 bath — one up, one down"],
  ["Enclosed", "768 sf · 16 × 32 ft footprint"],
  ["Roof deck", "256 sf cable rail over living"],
  ["Ground deck", "400 sf open teak (not screened)"],
  ["Stair", "Black steel spiral, exterior, rust end"],
  ["Cladding", "Cedar lap over steel · corten container end"],
  ["Lot", "115 · ¼ acre · canal bank · 20 ft setback"],
  ["Assembly", "13 days on site"],
];

export const COMPARE_ROWS: { label: string; hip: string; spiral: string }[] = [
  { label: "Look", hip: "Salt-white hip roof", spiral: "Cedar lap + corten container" },
  { label: "Stories", hip: "Single", spiral: "Two-story, partial upper" },
  { label: "Enclosed", hip: "581 sf", spiral: "768 sf" },
  { label: "Beds / baths", hip: "2BR / 2BA, both grade", spiral: "2BR / 2BA, one up / one down" },
  { label: "Stair", hip: "None", spiral: "Black spiral, exterior" },
  { label: "Deck", hip: "400 sf mosquito-screened", spiral: "400 sf open teak + 256 sf roof" },
  { label: "Assembly", hip: "8 days", spiral: "13 days" },
];

export const SPIRAL_ROOF_LINES = [
  { sku: "CS-AD01", item: "Teak Adirondack chair", qty: 2, unit: 280 },
  { sku: "CS-PL02", item: "Roof-deck planter", qty: 2, unit: 95 },
];

export function spiralBreakdown(s: QuoteStyle = SPIRAL_STYLE) {
  return [
    ["Unfurnished shell", factoryOnSite(s)],
    ["Ocean freight", s.freight],
    ["Inland + duties", s.inland],
    ["Slab, excavation, MEP", PRICE.slabMep],
    ["Hurricane tie-downs", s.tie],
    ["Crane", s.crane],
    ["Subtotal shell", shellSubtotal(s)],
    ["Contingency", PRICE.contingency],
    ["400 sf open deck + roof deck + fence", siteworkFor(s)],
    ["Assembly labor", laborFor(s)],
    ["Furnishings, fully installed", ffeFor(s)],
  ] as const;
}

export function hipVsSpiral() {
  return {
    hip: HIP_STYLE,
    spiral: SPIRAL_STYLE,
    hipTotal: allInOne(HIP_STYLE),
    spiralTotal: allInOne(SPIRAL_STYLE),
    delta: allInOne(SPIRAL_STYLE) - allInOne(HIP_STYLE),
  };
}

export {
  HIP_STYLE,
  SPIRAL_STYLE,
  allInOne,
  factoryOnSite,
  ffeFor,
  groupTotal,
  kitTotal,
  laborFor,
  shellSubtotal,
  siteworkFor,
  usd,
  KITS,
  PRICE,
  SPIRAL_SITE,
  SPIRAL_SITE_TOTAL,
  SPIRAL_ROOF_FFE,
};
