/** Seeded full-community layout. Every buildable lot gets a steel or wood home. */

export type Kind = "steel" | "wood";
export type Zone = "beach" | "canal" | "park" | "street" | "gate" | "interior";
export type RoomKind = "live" | "kitchen" | "bed" | "bath" | "studio";

export type RoomSpec = { id: string; name: string };

export type PlanRoom = {
  id: string;
  name: string;
  x: number;
  z: number;
  w: number;
  d: number;
  floor: 1 | 2;
  kind: RoomKind;
};

export type Archetype = {
  id: string;
  kind: Kind;
  name: string;
  size: string;
  beds: string;
  area: string;
  w: number;
  d: number;
  h: number;
  stories: 1 | 2;
  rooms: RoomSpec[];
  plan: PlanRoom[];
};

export type Lot = {
  n: number;
  x: number;
  z: number;
  rot: number;
  zone: Zone;
  arch: string;
  color: number;
  roof: number;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STEEL_VILLA_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 2.6, w: 3.0, d: 4.4, floor: 1, kind: "live" },
  { id: "kitchen", name: "Kitchen", x: 0, z: -0.6, w: 3.0, d: 2.0, floor: 1, kind: "kitchen" },
  { id: "bath", name: "Bath", x: 0, z: -3.6, w: 3.0, d: 2.6, floor: 1, kind: "bath" },
  { id: "bed1", name: "Primary", x: 0, z: 2.2, w: 3.0, d: 4.0, floor: 2, kind: "bed" },
  { id: "bed2", name: "Bedroom 2", x: 0, z: -2.4, w: 3.0, d: 4.4, floor: 2, kind: "bed" },
];

const STEEL_LINEAR_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 3.4, w: 2.8, d: 3.2, floor: 1, kind: "live" },
  { id: "kitchen", name: "Kitchen", x: 0, z: 0.6, w: 2.8, d: 2.2, floor: 1, kind: "kitchen" },
  { id: "bed1", name: "Bedroom", x: 0, z: -1.8, w: 2.8, d: 2.6, floor: 1, kind: "bed" },
  { id: "bath", name: "Bath", x: 0, z: -4.2, w: 2.8, d: 1.8, floor: 1, kind: "bath" },
];

const STEEL_CUBE_PLAN: PlanRoom[] = [
  { id: "living", name: "Live / loft", x: 0, z: 0.2, w: 3.2, d: 4.6, floor: 1, kind: "studio" },
  { id: "bath", name: "Bath", x: 0, z: -2.0, w: 3.2, d: 1.2, floor: 1, kind: "bath" },
  { id: "bed1", name: "Loft bed", x: 0, z: 0, w: 3.0, d: 4.0, floor: 2, kind: "bed" },
];

const WOOD_BAY_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 2.6, w: 5.0, d: 4.6, floor: 1, kind: "live" },
  { id: "kitchen", name: "Kitchen", x: 1.3, z: -0.8, w: 2.4, d: 2.2, floor: 1, kind: "kitchen" },
  { id: "bed1", name: "Primary", x: -1.3, z: -0.8, w: 2.4, d: 2.2, floor: 1, kind: "bed" },
  { id: "bed2", name: "Bedroom 2", x: -1.3, z: -3.6, w: 2.4, d: 2.4, floor: 1, kind: "bed" },
  { id: "bed3", name: "Bedroom 3", x: 1.3, z: -3.6, w: 2.4, d: 2.4, floor: 1, kind: "bed" },
];

const WOOD_MID_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 2.2, w: 4.4, d: 3.4, floor: 1, kind: "live" },
  { id: "kitchen", name: "Kitchen", x: 1.1, z: -0.6, w: 2.2, d: 2.2, floor: 1, kind: "kitchen" },
  { id: "bed1", name: "Primary", x: -1.1, z: -0.6, w: 2.2, d: 2.2, floor: 1, kind: "bed" },
  { id: "bed2", name: "Bedroom 2", x: 0, z: -3.0, w: 4.4, d: 2.0, floor: 1, kind: "bed" },
];

const WOOD_PARK_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 2.4, w: 4.6, d: 3.6, floor: 1, kind: "live" },
  { id: "kitchen", name: "Kitchen", x: 1.1, z: -0.4, w: 2.4, d: 2.0, floor: 1, kind: "kitchen" },
  { id: "bed1", name: "Primary", x: -1.1, z: -0.4, w: 2.4, d: 2.0, floor: 1, kind: "bed" },
  { id: "bed2", name: "Bedroom 2", x: 0, z: -3.2, w: 4.6, d: 2.2, floor: 1, kind: "bed" },
];

const WOOD_SMALL_PLAN: PlanRoom[] = [
  { id: "living", name: "Living", x: 0, z: 1.6, w: 3.4, d: 2.8, floor: 1, kind: "live" },
  { id: "bed1", name: "Bedroom", x: 0, z: -1.2, w: 3.4, d: 2.2, floor: 1, kind: "bed" },
  { id: "bath", name: "Bath", x: 0, z: -2.8, w: 3.4, d: 1.2, floor: 1, kind: "bath" },
];

const WOOD_STUDIO_PLAN: PlanRoom[] = [
  { id: "living", name: "Studio", x: 0, z: 0.4, w: 3.0, d: 2.6, floor: 1, kind: "studio" },
  { id: "bath", name: "Bath", x: 0, z: -1.4, w: 3.0, d: 1.0, floor: 1, kind: "bath" },
];

export const ARCH: Record<string, Archetype> = {
  "steel-villa": {
    id: "steel-villa",
    kind: "steel",
    name: "Two-level container",
    size: "16 × 40 ft",
    beds: "3 bed / 2 bath",
    area: "1,057 sf",
    w: 3.2,
    d: 10.4,
    h: 5.4,
    stories: 2,
    rooms: STEEL_VILLA_PLAN.filter((r) => r.floor === 1).map(({ id, name }) => ({ id, name })),
    plan: STEEL_VILLA_PLAN,
  },
  "steel-linear": {
    id: "steel-linear",
    kind: "steel",
    name: "Linear container",
    size: "16 × 40 ft",
    beds: "2 bed / 1 bath",
    area: "640 sf",
    w: 3.0,
    d: 10.4,
    h: 2.9,
    stories: 1,
    rooms: STEEL_LINEAR_PLAN.map(({ id, name }) => ({ id, name })),
    plan: STEEL_LINEAR_PLAN,
  },
  "steel-cube": {
    id: "steel-cube",
    kind: "steel",
    name: "Loft cube",
    size: "16 × 20 ft",
    beds: "1 bed + loft",
    area: "320 sf",
    w: 3.4,
    d: 5.2,
    h: 4.4,
    stories: 2,
    rooms: STEEL_CUBE_PLAN.filter((r) => r.floor === 1).map(({ id, name }) => ({ id, name })),
    plan: STEEL_CUBE_PLAN,
  },
  "wood-bay": {
    id: "wood-bay",
    kind: "wood",
    name: "Bay hip",
    size: "20 × 40 ft",
    beds: "3 bed / 2 bath",
    area: "800 sf",
    w: 5.2,
    d: 10.4,
    h: 3.6,
    stories: 1,
    rooms: WOOD_BAY_PLAN.map(({ id, name }) => ({ id, name })),
    plan: WOOD_BAY_PLAN,
  },
  "wood-mid": {
    id: "wood-mid",
    kind: "wood",
    name: "Canal gable",
    size: "20 × 30 ft",
    beds: "2 bed / 2 bath",
    area: "600 sf",
    w: 4.6,
    d: 8.0,
    h: 3.4,
    stories: 1,
    rooms: WOOD_MID_PLAN.map(({ id, name }) => ({ id, name })),
    plan: WOOD_MID_PLAN,
  },
  "wood-park": {
    id: "wood-park",
    kind: "wood",
    name: "Park porch",
    size: "20 × 34 ft",
    beds: "2 bed / 2 bath",
    area: "680 sf",
    w: 4.8,
    d: 8.8,
    h: 3.4,
    stories: 1,
    rooms: WOOD_PARK_PLAN.map(({ id, name }) => ({ id, name })),
    plan: WOOD_PARK_PLAN,
  },
  "wood-small": {
    id: "wood-small",
    kind: "wood",
    name: "Street cottage",
    size: "16 × 24 ft",
    beds: "2 bed / 1 bath",
    area: "384 sf",
    w: 3.6,
    d: 6.2,
    h: 3.0,
    stories: 1,
    rooms: WOOD_SMALL_PLAN.map(({ id, name }) => ({ id, name })),
    plan: WOOD_SMALL_PLAN,
  },
  "wood-studio": {
    id: "wood-studio",
    kind: "wood",
    name: "Studio cube",
    size: "16 × 16 ft",
    beds: "Studio / 1 bath",
    area: "256 sf",
    w: 3.2,
    d: 3.4,
    h: 2.8,
    stories: 1,
    rooms: WOOD_STUDIO_PLAN.map(({ id, name }) => ({ id, name })),
    plan: WOOD_STUDIO_PLAN,
  },
};

const STEEL_COLORS = [0x1fa6a0, 0x2b3038, 0x3d444c, 0xe7ece8, 0x4a5560, 0xc45c3e];
const WOOD_COLORS = [0x8b5a32, 0xf3eee4, 0xc4a574, 0xd8d0c4, 0x5c4033, 0xe8dcc8];
const ROOFS = [0xc5c8c4, 0xb8b3a8, 0x3a3a3a, 0x5c6564];

const BEACH_POOL = ["wood-bay", "steel-villa", "wood-bay", "steel-villa", "wood-mid"];
const CANAL_POOL = ["wood-mid", "steel-linear", "wood-park", "steel-villa", "wood-small"];
const GATE_POOL = ["wood-small", "steel-cube", "wood-studio", "steel-linear"];
const PARK_POOL = ["wood-park", "wood-mid", "steel-linear", "wood-small"];
const STREET_POOL = ["wood-small", "wood-studio", "steel-cube", "wood-park", "steel-linear"];
const INTERIOR_POOL = ["wood-small", "wood-mid", "steel-linear", "wood-park", "wood-studio", "steel-cube", "wood-bay"];

function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length) % list.length];
}

const COL_W = 8.2;
const ROW_D = 11.4;

/**
 * Real Consejo geography (from the July 2026 plat + drone gallery):
 *   WEST  mangrove swamp → canal (N–S, then a south arm into the bay)
 *   EAST  Chetumal Bay / beach peninsula
 *   NORTH gated entrance
 * Houses sit on dry land. Canal lots face west to the water; beach lots face east to the bay.
 */
export const SITE = {
  colW: COL_W,
  rowD: ROW_D,
  canalX: 11.5,
  canalW: 11,
  mangroveX: 3.4,
  mangroveW: 8,
  bankX: 18.5,
  bayX: 21 * COL_W,
  bayW: 46,
};

type Cell = { c: number; r: number; zone: Zone; rot: number };

function cells(): Cell[] {
  const out: Cell[] = [];
  const skip = new Set<string>();
  const mark = (c: number, r: number) => skip.add(`${c},${r}`);

  for (let c = 0; c < 26; c++) mark(c, 0);
  for (let r = 0; r < 16; r++) {
    mark(0, r);
    mark(1, r);
    mark(2, r);
    mark(21, r);
    mark(22, r);
    mark(23, r);
    mark(24, r);
  }
  for (let c = 8; c <= 10; c++) {
    mark(c, 7);
    mark(c, 8);
  }
  for (let c = 14; c <= 15; c++) {
    mark(c, 4);
    mark(c, 5);
  }

  function zoneFor(c: number, r: number): { zone: Zone; rot: number } {
    if (c === 20) return { zone: "beach", rot: Math.PI / 2 };
    if (c === 3) return { zone: "canal", rot: -Math.PI / 2 };
    if (c === 4 && r >= 1 && r <= 8) return { zone: "gate", rot: -Math.PI / 2 };
    if (r >= 11 && r <= 12 && c >= 12 && c <= 17) return { zone: "park", rot: 0 };
    if (r >= 13 && c >= 12 && c <= 19) return { zone: "street", rot: 0 };
    return { zone: "interior", rot: r % 2 === 0 ? 0 : Math.PI };
  }

  for (let r = 1; r <= 15; r++) {
    for (let c = 3; c <= 20; c++) {
      if (skip.has(`${c},${r}`)) continue;
      const z = zoneFor(c, r);
      out.push({ c, r, zone: z.zone, rot: z.rot });
    }
  }
  return out;
}

function poolFor(zone: Zone) {
  if (zone === "beach") return BEACH_POOL;
  if (zone === "canal") return CANAL_POOL;
  if (zone === "gate") return GATE_POOL;
  if (zone === "park") return PARK_POOL;
  if (zone === "street") return STREET_POOL;
  return INTERIOR_POOL;
}

const FEATURED: Record<number, { c: number; r: number; zone: Zone; rot: number; arch: string }> = {
  196: { c: 20, r: 3, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  197: { c: 20, r: 4, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  198: { c: 20, r: 5, zone: "beach", rot: Math.PI / 2, arch: "steel-villa" },
  199: { c: 20, r: 6, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  200: { c: 20, r: 7, zone: "beach", rot: Math.PI / 2, arch: "steel-villa" },
  201: { c: 20, r: 8, zone: "beach", rot: Math.PI / 2, arch: "wood-mid" },
  202: { c: 20, r: 9, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  203: { c: 20, r: 10, zone: "beach", rot: Math.PI / 2, arch: "steel-villa" },
  204: { c: 20, r: 11, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  205: { c: 20, r: 12, zone: "beach", rot: Math.PI / 2, arch: "wood-mid" },
  206: { c: 20, r: 13, zone: "beach", rot: Math.PI / 2, arch: "steel-villa" },
  207: { c: 20, r: 14, zone: "beach", rot: Math.PI / 2, arch: "wood-bay" },
  208: { c: 20, r: 15, zone: "beach", rot: Math.PI / 2, arch: "steel-villa" },
  103: { c: 3, r: 3, zone: "canal", rot: -Math.PI / 2, arch: "wood-mid" },
  104: { c: 3, r: 4, zone: "canal", rot: -Math.PI / 2, arch: "steel-linear" },
  105: { c: 3, r: 5, zone: "canal", rot: -Math.PI / 2, arch: "wood-mid" },
  106: { c: 3, r: 6, zone: "canal", rot: -Math.PI / 2, arch: "wood-park" },
  107: { c: 3, r: 7, zone: "canal", rot: -Math.PI / 2, arch: "steel-villa" },
  108: { c: 3, r: 8, zone: "canal", rot: -Math.PI / 2, arch: "wood-small" },
  109: { c: 3, r: 9, zone: "canal", rot: -Math.PI / 2, arch: "steel-cube" },
  110: { c: 3, r: 10, zone: "canal", rot: -Math.PI / 2, arch: "wood-mid" },
  111: { c: 3, r: 11, zone: "canal", rot: -Math.PI / 2, arch: "steel-linear" },
  112: { c: 3, r: 12, zone: "canal", rot: -Math.PI / 2, arch: "wood-small" },
  113: { c: 3, r: 13, zone: "canal", rot: -Math.PI / 2, arch: "wood-studio" },
  114: { c: 3, r: 14, zone: "canal", rot: -Math.PI / 2, arch: "steel-linear" },
  330: { c: 4, r: 1, zone: "gate", rot: -Math.PI / 2, arch: "wood-small" },
  315: { c: 4, r: 2, zone: "gate", rot: -Math.PI / 2, arch: "steel-cube" },
  314: { c: 4, r: 3, zone: "gate", rot: -Math.PI / 2, arch: "wood-mid" },
  169: { c: 4, r: 4, zone: "gate", rot: -Math.PI / 2, arch: "steel-linear" },
  168: { c: 4, r: 5, zone: "gate", rot: -Math.PI / 2, arch: "wood-studio" },
  167: { c: 4, r: 6, zone: "gate", rot: -Math.PI / 2, arch: "wood-small" },
  165: { c: 4, r: 7, zone: "gate", rot: -Math.PI / 2, arch: "steel-cube" },
  234: { c: 12, r: 11, zone: "park", rot: 0, arch: "wood-park" },
  235: { c: 13, r: 11, zone: "park", rot: 0, arch: "wood-mid" },
  236: { c: 14, r: 11, zone: "park", rot: 0, arch: "steel-linear" },
  237: { c: 15, r: 11, zone: "park", rot: 0, arch: "wood-park" },
  238: { c: 16, r: 11, zone: "park", rot: 0, arch: "wood-mid" },
  239: { c: 17, r: 11, zone: "park", rot: 0, arch: "steel-linear" },
  241: { c: 12, r: 13, zone: "street", rot: 0, arch: "wood-studio" },
  252: { c: 12, r: 14, zone: "street", rot: 0, arch: "wood-small" },
  253: { c: 13, r: 14, zone: "street", rot: 0, arch: "wood-small" },
  254: { c: 14, r: 14, zone: "street", rot: 0, arch: "steel-cube" },
  255: { c: 15, r: 14, zone: "street", rot: 0, arch: "wood-park" },
  256: { c: 16, r: 14, zone: "street", rot: 0, arch: "steel-cube" },
  257: { c: 17, r: 14, zone: "street", rot: 0, arch: "wood-studio" },
  258: { c: 18, r: 14, zone: "street", rot: 0, arch: "wood-small" },
  259: { c: 19, r: 14, zone: "street", rot: 0, arch: "steel-linear" },
};

export const FEATURED_LOTS = new Set(Object.keys(FEATURED).map(Number));

function buildLots(): Lot[] {
  const rand = rng(20260909);
  const grid = cells();
  const takenCells = new Set<string>();
  const usedN = new Set<number>();
  const lots: Lot[] = [];

  function add(n: number, c: number, r: number, zone: Zone, rot: number, archId: string) {
    if (usedN.has(n)) return;
    usedN.add(n);
    takenCells.add(`${c},${r}`);
    const arch = ARCH[archId];
    const colors = arch.kind === "steel" ? STEEL_COLORS : WOOD_COLORS;
    lots.push({
      n,
      x: c * COL_W,
      z: r * ROW_D,
      rot,
      zone,
      arch: archId,
      color: colors[Math.floor(rand() * colors.length)],
      roof: pick(rand, ROOFS),
    });
  }

  for (const [num, spec] of Object.entries(FEATURED)) {
    add(Number(num), spec.c, spec.r, spec.zone, spec.rot, spec.arch);
  }

  const leftovers = grid.filter((g) => !takenCells.has(`${g.c},${g.r}`));
  const remainingNums: number[] = [];
  for (let i = 1; i <= 330; i++) if (!usedN.has(i)) remainingNums.push(i);

  leftovers.forEach((g, i) => {
    const n = remainingNums[i];
    if (n == null) return;
    add(n, g.c, g.r, g.zone, g.rot, pick(rand, poolFor(g.zone)));
  });

  lots.sort((a, b) => a.n - b.n);
  return lots;
}

export const LOTS: Lot[] = buildLots();
export const LOT_BY_N = new Map(LOTS.map((l) => [l.n, l]));

export const WORLD = {
  colW: COL_W,
  rowD: ROW_D,
  cols: 25,
  rows: 16,
  width: 25 * COL_W,
  depth: 16 * ROW_D,
};

export function lotArchetype(lot: Lot) {
  return ARCH[lot.arch];
}

export function lotPlan(lot: Lot) {
  return ARCH[lot.arch].plan;
}

export function counts() {
  let steel = 0;
  let wood = 0;
  const byArch: Record<string, number> = {};
  for (const l of LOTS) {
    if (ARCH[l.arch].kind === "steel") steel += 1;
    else wood += 1;
    byArch[l.arch] = (byArch[l.arch] ?? 0) + 1;
  }
  return { total: LOTS.length, steel, wood, byArch };
}

export const ZONE_LABEL: Record<Zone, string> = {
  beach: "Beach",
  canal: "Canal",
  park: "Park street",
  street: "Interior street",
  gate: "Gate row",
  interior: "Interior",
};

export function randomLotN(except?: number) {
  const pool = except == null ? LOTS : LOTS.filter((l) => l.n !== except);
  return pool[Math.floor(Math.random() * pool.length)].n;
}
