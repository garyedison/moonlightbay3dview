export type FfeLine = {
  sku: string;
  item: string;
  qty: number;
  unit: number;
};

export type FfeGroup = {
  id: string;
  title: string;
  lines: FfeLine[];
};

export type QuoteStyle = {
  id: string;
  sku: string;
  name: string;
  beds: string;
  area: string;
  story: "Single" | "Two-story";
  look: string;
  ship: string;
  factory: number;
  freight: number;
  inland: number;
  slab: number;
  tie: number;
  crane: number;
  exterior: { image: string; title: string; note: string };
  rooms: { id: string; name: string; image: string; caption: string }[];
  kit: "S" | "M" | "L";
};

export const QUOTE = {
  preparedFor: "Ailist Huang — KDK Senior PM (HK)",
  billTo: "HMS Holdings LLC — John Hyde",
  customer: "2479 Peachtree Rd NE 708, Atlanta, GA 30305",
  lots: [115, 127] as const,
  address: "Moonlight Bay de Consejo · 240-A Bayview Drive, Consejo, Belize",
  lotNote:
    "Lot 115 sits on the canal bank. Lot 127 sits inland across the dirt road, looking at Lot 115. The porch on 127 faces the road and the neighbor — the water is hard to see from that deck.",
  deck: {
    area: 400,
    note: "Same 400 sf teak deck on every style, fully enclosed with mosquito screen walls and roof, white posts, ceiling fans.",
  },
};

const EXTERIOR_PKG = 33900;
const FENCE = 7200;
const DECK = 14000;
const SCREEN = 9500;
const RAIL = 3200;

export const SITEWORK = {
  exterior: EXTERIOR_PKG,
  deck: DECK,
  screen: SCREEN,
  rail: RAIL,
  fence: FENCE,
  laborSingle: 8500,
  laborStack: 13500,
};

/** Quote uplifts requested for lots 115 / 127 presentations. */
export const PRICE = {
  slabMep: 35000,
  contingency: 20000,
  shellUplift: 1.5,
  laborUplift: 1.3,
  ffeFurnished: 30000,
};

function living(): FfeLine[] {
  return [
    { sku: "CS-SF84", item: "Sand linen sofa 84″", qty: 1, unit: 1450 },
    { sku: "CS-RC01", item: "Rattan lounge chair", qty: 2, unit: 390 },
    { sku: "CS-CT01", item: "Teak coffee table", qty: 1, unit: 380 },
    { sku: "CS-RG80", item: "Seagrass rug 8×10", qty: 1, unit: 420 },
    { sku: "CS-LP01", item: "Rattan floor lamp", qty: 1, unit: 165 },
    { sku: "CS-PL01", item: "Lagoon / sand pillow set", qty: 1, unit: 120 },
  ];
}

function kitchen(): FfeLine[] {
  return [
    { sku: "CS-BS01", item: "Teak bar stool", qty: 2, unit: 165 },
    { sku: "CS-PN01", item: "Woven pendant", qty: 2, unit: 145 },
    { sku: "CS-TW01", item: "Tableware starter (4-place)", qty: 1, unit: 220 },
  ];
}

function bed(primary: boolean): FfeLine[] {
  const q = primary ? "Queen" : "Queen (guest)";
  return [
    { sku: primary ? "CS-BD-Q" : "CS-BD-G", item: `${q} teak bed frame`, qty: 1, unit: primary ? 980 : 880 },
    { sku: "CS-HB01", item: "Rattan headboard", qty: 1, unit: primary ? 420 : 320 },
    { sku: "CS-LN01", item: "Ivory linen duvet set", qty: 1, unit: primary ? 240 : 220 },
    { sku: "CS-NS01", item: "Teak nightstand", qty: primary ? 2 : 1, unit: 210 },
    { sku: "CS-TL01", item: "Linen table lamp", qty: primary ? 2 : 1, unit: 95 },
    { sku: "CS-WD01", item: "Teak wardrobe", qty: 1, unit: primary ? 780 : 620 },
  ];
}

function bath(): FfeLine[] {
  return [
    { sku: "CS-MR01", item: "Rattan bath mirror", qty: 1, unit: 140 },
    { sku: "CS-BL01", item: "Bath linen set", qty: 1, unit: 95 },
    { sku: "CS-VA01", item: "Teak vanity tray + hardware", qty: 1, unit: 85 },
  ];
}

function deckFfe(): FfeLine[] {
  return [
    { sku: "CS-DT72", item: "Teak dining table 72″ (screened porch)", qty: 1, unit: 890 },
    { sku: "CS-DC01", item: "Rattan dining chair", qty: 6, unit: 190 },
    { sku: "CS-CF01", item: "Ceiling fan, charcoal", qty: 2, unit: 140 },
    { sku: "CS-DB01", item: "Linen daybed", qty: 1, unit: 740 },
    { sku: "CS-LN3", item: "Outdoor lantern", qty: 3, unit: 55 },
  ];
}

function studio(): FfeLine[] {
  return [
    { sku: "CS-SF72", item: "Sand linen sofa 72″ (studio)", qty: 1, unit: 1180 },
    { sku: "CS-BD-Q", item: "Queen teak bed frame", qty: 1, unit: 980 },
    { sku: "CS-HB01", item: "Rattan headboard", qty: 1, unit: 420 },
    { sku: "CS-LN01", item: "Ivory linen duvet set", qty: 1, unit: 240 },
    { sku: "CS-NS01", item: "Teak nightstand", qty: 1, unit: 210 },
    { sku: "CS-RC01", item: "Rattan lounge chair", qty: 1, unit: 390 },
    { sku: "CS-RG80", item: "Seagrass rug 8×10", qty: 1, unit: 420 },
    { sku: "CS-WD01", item: "Teak wardrobe", qty: 1, unit: 620 },
  ];
}

export const KITS: Record<"S" | "M" | "L", FfeGroup[]> = {
  S: [
    { id: "studio", title: "Studio live / sleep", lines: studio() },
    { id: "kitchen", title: "Kitchen loose", lines: kitchen() },
    { id: "bath", title: "Bath 1", lines: bath() },
    { id: "deck", title: "Screened 400 sf deck", lines: deckFfe() },
  ],
  M: [
    { id: "living", title: "Living", lines: living() },
    { id: "kitchen", title: "Kitchen loose", lines: kitchen() },
    { id: "bed1", title: "Primary bedroom", lines: bed(true) },
    { id: "bed2", title: "Bedroom 2", lines: bed(false) },
    { id: "bath", title: "Bath 1", lines: bath() },
    { id: "deck", title: "Screened 400 sf deck", lines: deckFfe() },
  ],
  L: [
    { id: "living", title: "Living", lines: living() },
    { id: "kitchen", title: "Kitchen loose", lines: kitchen() },
    { id: "bed1", title: "Primary bedroom", lines: bed(true) },
    { id: "bed2", title: "Bedroom 2", lines: bed(false) },
    { id: "bath1", title: "Bath 1", lines: bath() },
    { id: "bath2", title: "Bath 2", lines: bath() },
    { id: "deck", title: "Screened 400 sf deck", lines: deckFfe() },
  ],
};

export function groupTotal(g: FfeGroup) {
  return g.lines.reduce((s, l) => s + l.qty * l.unit, 0);
}

export function kitTotal(kit: "S" | "M" | "L") {
  return KITS[kit].reduce((s, g) => s + groupTotal(g), 0);
}

const twoBrRooms = [
  { id: "living", name: "Living", image: "/villa/living.jpg", caption: "Sand linen sofa, rattan, seagrass — same kit on both lots." },
  { id: "kitchen", name: "Kitchen", image: "/villa/kitchen.jpg", caption: "Teak millwork, limestone, sea-glass tile." },
  { id: "bed1", name: "Primary", image: "/villa/bedroom-canal.jpg", caption: "Ivory linen, rattan headboard, teak nightstands." },
  { id: "bed2", name: "Bedroom 2", image: "/villa/bedroom-guest.jpg", caption: "Same furniture family as the primary." },
  { id: "bath", name: "Bath", image: "/villa/bath.jpg", caption: "Honed limestone and teak vanity." },
  { id: "deck", name: "Screened deck", image: "/quote/screened-deck.jpg", caption: "400 sf teak porch, mosquito mesh, fans, dining." },
];

const oneBrRooms = [
  { id: "studio", name: "Live / sleep", image: "/quote/studio-live.jpg", caption: "Compact 1BR: sofa and queen in one Caribbean Salt room." },
  { id: "kitchen", name: "Kitchen", image: "/villa/kitchen.jpg", caption: "Same teak galley SKU, scaled." },
  { id: "bath", name: "Bath", image: "/villa/bath.jpg", caption: "One wet room, limestone and teak." },
  { id: "deck", name: "Screened deck", image: "/quote/screened-deck.jpg", caption: "The 400 sf screened porch is the evening room." },
];

export const STYLES: QuoteStyle[] = [
  {
    id: "pt211222",
    sku: "PT211222",
    name: "Hip roof",
    beds: "2BR / 2BA",
    area: "54 m² / 581 sf",
    story: "Single",
    look: "Premium hip roof, long plan",
    ship: "2 / 40HQ",
    factory: 23000,
    freight: 9500,
    inland: 5000,
    slab: 20000,
    tie: 2000,
    crane: 2500,
    kit: "L",
    exterior: {
      image: "/quote/pt211222.jpg",
      title: "Lot 115 · hip roof",
      note: "Salt-white hip roof, lagoon door, 400 sf screened teak porch.",
    },
    rooms: twoBrRooms,
  },
  {
    id: "pt220348-2",
    sku: "PT220348-2",
    name: "Skillion long",
    beds: "2BR / 1BA",
    area: "59 m² / 635 sf",
    story: "Single",
    look: "Skillion roof, long plan",
    ship: "2 / 40HQ",
    factory: 18250,
    freight: 9500,
    inland: 5000,
    slab: 20000,
    tie: 2000,
    crane: 2500,
    kit: "M",
    exterior: {
      image: "/quote/pt220348-2.jpg",
      title: "Lot 127 · skillion long",
      note: "Charcoal skillion, salt-white walls, screened porch along the garden.",
    },
    rooms: twoBrRooms,
  },
  {
    id: "pt220348-3",
    sku: "PT220348-3",
    name: "Skillion terrace",
    beds: "2BR / 1BA",
    area: "44 m² / 473 sf",
    story: "Single",
    look: "Compact skillion + terrace",
    ship: "2 / 40HQ",
    factory: 20650,
    freight: 9500,
    inland: 5000,
    slab: 20000,
    tie: 2000,
    crane: 2500,
    kit: "M",
    exterior: {
      image: "/quote/pt220348-3.jpg",
      title: "Lot 115 · skillion terrace",
      note: "Smaller shell, same 400 sf screened deck as the evening room.",
    },
    rooms: twoBrRooms,
  },
  {
    id: "pt220348-1",
    sku: "PT220348-1",
    name: "Compact terrace",
    beds: "1BR / 1BA",
    area: "29 m² / 312 sf",
    story: "Single",
    look: "Compact 20-ft, terrace",
    ship: "3 / 40HQ",
    factory: 15850,
    freight: 6333,
    inland: 5000,
    slab: 20000,
    tie: 2000,
    crane: 2500,
    kit: "S",
    exterior: {
      image: "/quote/pt220348-1.jpg",
      title: "Lot 127 · compact 1BR",
      note: "Smallest factory shell. The screened deck is larger than the house.",
    },
    rooms: oneBrRooms,
  },
  {
    id: "pt210223-2",
    sku: "PT210223-2",
    name: "Carport",
    beds: "2BR / 1BA",
    area: "59 m² / 635 sf",
    story: "Single",
    look: "Single story with carport",
    ship: "1.23 / 40HQ",
    factory: 17500,
    freight: 15447,
    inland: 5000,
    slab: 20000,
    tie: 2000,
    crane: 2500,
    kit: "M",
    exterior: {
      image: "/quote/pt210223-2.jpg",
      title: "Lot 115 · carport",
      note: "Covered parking, salt-white shell, screened porch on the garden side.",
    },
    rooms: twoBrRooms,
  },
  {
    id: "pt190249",
    sku: "PT190249",
    name: "Two-story stair",
    beds: "1BR / 1BA",
    area: "60 m² / 646 sf",
    story: "Two-story",
    look: "Two-story, external stair",
    ship: "1.5 / 40HQ",
    factory: 21000,
    freight: 12667,
    inland: 5000,
    slab: 22000,
    tie: 2500,
    crane: 3500,
    kit: "S",
    exterior: {
      image: "/quote/pt190249.jpg",
      title: "Lot 127 · two-story stair",
      note: "External teak stair, loft bedroom, screened deck at grade.",
    },
    rooms: oneBrRooms,
  },
  {
    id: "pt200009",
    sku: "PT200009",
    name: "Two-story gable",
    beds: "2BR / 1BA",
    area: "60 m² / 646 sf",
    story: "Two-story",
    look: "Two-story gable",
    ship: "1 / 40HQ",
    factory: 17500,
    freight: 19000,
    inland: 5000,
    slab: 22000,
    tie: 2500,
    crane: 3500,
    kit: "M",
    exterior: {
      image: "/quote/pt200009.jpg",
      title: "Lot 127 · two-story gable",
      note: "Inland of the dirt road. Porch faces Lot 115 across the street — water is hard to see.",
    },
    rooms: twoBrRooms,
  },
];

export function factoryOnSite(s: QuoteStyle) {
  return Math.round(s.factory * PRICE.shellUplift);
}

export function shellSubtotal(s: QuoteStyle) {
  return factoryOnSite(s) + s.freight + s.inland + PRICE.slabMep + s.tie + s.crane;
}

export function laborFor(s: QuoteStyle) {
  const base = s.story === "Two-story" ? SITEWORK.laborStack : SITEWORK.laborSingle;
  return Math.round(base * PRICE.laborUplift);
}

export function ffeFor(s: QuoteStyle) {
  return kitTotal(s.kit) + PRICE.ffeFurnished;
}

export function allInOne(s: QuoteStyle) {
  return shellSubtotal(s) + PRICE.contingency + SITEWORK.exterior + laborFor(s) + ffeFor(s);
}

export function pairTotal(s: QuoteStyle) {
  return allInOne(s) * 2;
}

export function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
