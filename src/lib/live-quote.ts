import {
  CUSTOMER_STYLES,
  FFE_FREIGHT_HINT,
  FFE_FREIGHT_LABEL,
  HIP_STYLE,
  KITS,
  PRICE,
  SITEWORK,
  SPIRAL_STYLE,
  STYLES,
  factoryOnSite,
  groupTotal,
  laborFor,
  type FfeGroup,
  type QuoteStyle,
} from "./quote";
import { SPIRAL_ROOF_LINES, SPIRAL_SITE } from "./spiral";

export type LiveSection = "landed" | "civil" | "site" | "labor" | "ffe";

export type LiveLine = {
  id: string;
  section: LiveSection;
  sectionLabel: string;
  label: string;
  hint?: string;
  amount: number;
};

export const SECTION_ORDER: LiveSection[] = ["landed", "civil", "site", "labor", "ffe"];

export const SECTION_COPY: Record<LiveSection, { title: string; blurb: string }> = {
  landed: {
    title: "Landed shell",
    blurb: "The house, ocean freight, and Belize inland. No site work yet.",
  },
  civil: {
    title: "Civil and MEP",
    blurb: "Slab, excavation, electrical, plumbing, ties, crane, and a contingency.",
  },
  site: {
    title: "On the lot",
    blurb: "Deck, roof, rail, fence — take any of these off.",
  },
  labor: {
    title: "Assembly",
    blurb: "Belize crew to set and finish the shell.",
  },
  ffe: {
    title: "FF&E",
    blurb:
      "Caribbean Salt furniture by room. A 20 ft container, DDP to the Moonlight Bay gate, ships the furniture. Take it off if you skip furnishings.",
  },
};

function siteLines(s: QuoteStyle): LiveLine[] {
  if (s.id === "cs-spiral") {
    return [
      { id: "deck", section: "site", sectionLabel: "On the lot", label: "400 sf open teak deck", amount: SPIRAL_SITE.deck },
      { id: "roof", section: "site", sectionLabel: "On the lot", label: "Roof-deck structure", amount: SPIRAL_SITE.roof },
      { id: "rail", section: "site", sectionLabel: "On the lot", label: "Cable rail", amount: SPIRAL_SITE.rail },
      { id: "fence", section: "site", sectionLabel: "On the lot", label: "Wood fence", amount: SPIRAL_SITE.fence },
    ];
  }
  return [
    { id: "deck", section: "site", sectionLabel: "On the lot", label: "400 sf teak deck", amount: SITEWORK.deck },
    { id: "screen", section: "site", sectionLabel: "On the lot", label: "Mosquito screen walls and roof", amount: SITEWORK.screen },
    { id: "rail", section: "site", sectionLabel: "On the lot", label: "Deck rail", amount: SITEWORK.rail },
    { id: "fence", section: "site", sectionLabel: "On the lot", label: "Wood fence", amount: SITEWORK.fence },
  ];
}

function ffeGroups(s: QuoteStyle): FfeGroup[] {
  const kit = KITS[s.kit].map((g) =>
    s.id === "cs-spiral" && g.id === "deck"
      ? { ...g, title: "Open 400 sf deck furniture" }
      : g,
  );
  if (s.id === "cs-spiral") {
    kit.push({
      id: "roof-ffe",
      title: "Roof-deck Adirondacks",
      lines: SPIRAL_ROOF_LINES,
    });
  }
  return kit;
}

export function liveLines(s: QuoteStyle): LiveLine[] {
  const civil = s.slab;
  const mep = PRICE.slabMep - s.slab;
  const out: LiveLine[] = [
    {
      id: "shell",
      section: "landed",
      sectionLabel: "Landed shell",
      label: "Unfurnished shell",
      hint: "Factory module, on site",
      amount: factoryOnSite(s),
    },
    {
      id: "freight",
      section: "landed",
      sectionLabel: "Landed shell",
      label: "Ocean freight",
      amount: s.freight,
    },
    {
      id: "inland",
      section: "landed",
      sectionLabel: "Landed shell",
      label: "Inland haul and duties",
      amount: s.inland,
    },
    {
      id: "civil",
      section: "civil",
      sectionLabel: "Civil and MEP",
      label: "Civil — slab, excavation, site prep",
      amount: civil,
    },
    {
      id: "mep",
      section: "civil",
      sectionLabel: "Civil and MEP",
      label: "MEP — electrical, plumbing, septic tie",
      amount: mep,
    },
    {
      id: "tie",
      section: "civil",
      sectionLabel: "Civil and MEP",
      label: "Hurricane tie-downs",
      amount: s.tie,
    },
    {
      id: "crane",
      section: "civil",
      sectionLabel: "Civil and MEP",
      label: "Crane",
      amount: s.crane,
    },
    {
      id: "contingency",
      section: "civil",
      sectionLabel: "Civil and MEP",
      label: "Contingency",
      amount: PRICE.contingency,
    },
    ...siteLines(s),
    {
      id: "labor",
      section: "labor",
      sectionLabel: "Assembly",
      label: `Assembly labor · ${s.laborDays} days`,
      amount: laborFor(s),
    },
  ];

  for (const g of ffeGroups(s)) {
    out.push({
      id: `ffe-${g.id}`,
      section: "ffe",
      sectionLabel: "FF&E",
      label: g.title,
      hint: g.lines.map((l) => (l.qty > 1 ? `${l.item} ×${l.qty}` : l.item)).join(" · "),
      amount: groupTotal(g),
    });
    for (const line of g.lines) {
      out.push({
        id: `ffe-${g.id}-${line.sku}`,
        section: "ffe",
        sectionLabel: "FF&E",
        label: line.qty > 1 ? `${line.item} ×${line.qty}` : line.item,
        hint: g.title,
        amount: line.qty * line.unit,
      });
    }
  }

  out.push({
    id: "ffe-install",
    section: "ffe",
    sectionLabel: "FF&E",
    label: "Factory fit and island install",
    hint: "Pack, set, and dress the house",
    amount: PRICE.ffeFurnished,
  });

  out.push({
    id: "ffe-freight",
    section: "ffe",
    sectionLabel: "FF&E",
    label: FFE_FREIGHT_LABEL,
    hint: FFE_FREIGHT_HINT,
    amount: PRICE.ffeFreight,
  });

  return out;
}

const FFE_STANDALONE = new Set(["ffe-install", "ffe-freight"]);

/** Parent FF&E group ids (not nested SKU rows, not install or container freight). */
export function isFfeChild(id: string) {
  return id.includes("-CS-");
}

export function isFfeParent(id: string) {
  return id.startsWith("ffe-") && !isFfeChild(id) && !FFE_STANDALONE.has(id);
}

export function childrenOf(parentId: string, lines: LiveLine[]) {
  const prefix = `${parentId}-`;
  return lines.filter((l) => l.id.startsWith(prefix) && isFfeChild(l.id));
}

export function parentOfChild(childId: string) {
  const at = childId.indexOf("-CS-");
  if (at < 0) return childId;
  return childId.slice(0, at);
}

export type PresetId = "landed" | "civil" | "unfurnished" | "furnished";

export const PRESETS: { id: PresetId; label: string; hint: string }[] = [
  { id: "landed", label: "Shell, landed", hint: "Factory + freight + inland" },
  { id: "civil", label: "Shell + civil / MEP", hint: "Landed, plus slab, MEP, ties, crane, contingency" },
  { id: "unfurnished", label: "Unfurnished on the lot", hint: "Ready to live in empty" },
  { id: "furnished", label: "Fully furnished", hint: "All-in, furniture plus 20 ft container DDP to the gate" },
];

export function presetIds(s: QuoteStyle, preset: PresetId, lines = liveLines(s)): string[] {
  if (preset === "furnished") return lines.map((l) => l.id);
  const keep = new Set<LiveSection>(
    preset === "landed"
      ? ["landed"]
      : preset === "civil"
        ? ["landed", "civil"]
        : ["landed", "civil", "site", "labor"],
  );
  return lines.filter((l) => keep.has(l.section)).map((l) => l.id);
}

export function defaultOn(s: QuoteStyle) {
  return new Set(presetIds(s, "furnished"));
}

export function sumOn(lines: LiveLine[], on: Set<string>) {
  const present = new Set(lines.map((l) => l.id));
  return lines.reduce((s, l) => {
    if (isFfeChild(l.id)) {
      const parent = parentOfChild(l.id);
      if (present.has(parent)) return s;
      if (on.has(l.id)) return s + l.amount;
      return s;
    }
    if (isFfeParent(l.id)) {
      const kids = childrenOf(l.id, lines);
      if (kids.some((k) => on.has(k.id))) {
        return s + kids.filter((k) => on.has(k.id)).reduce((a, k) => a + k.amount, 0);
      }
      if (on.has(l.id)) return s + l.amount;
      return s;
    }
    if (on.has(l.id)) return s + l.amount;
    return s;
  }, 0);
}

export function presetTotal(s: QuoteStyle, preset: PresetId) {
  const lines = liveLines(s);
  return sumOn(lines, new Set(presetIds(s, preset, lines)));
}

/** Display rows: skip nested SKU lines (they render under the parent). */
export function displayLines(lines: LiveLine[]) {
  return lines.filter((l) => !isFfeChild(l.id));
}

export function sectionTotal(lines: LiveLine[], on: Set<string>, section: LiveSection) {
  return sumOn(
    lines.filter((l) => l.section === section),
    on,
  );
}

const BOQ_SEEN = new Set<string>();
export const BOQ_STYLES = [SPIRAL_STYLE, ...CUSTOMER_STYLES, ...STYLES].filter((s) => {
  if (BOQ_SEEN.has(s.id)) return false;
  BOQ_SEEN.add(s.id);
  return true;
});

export { SPIRAL_STYLE, HIP_STYLE };
