export type ModelId = "v2" | "v3";
export type SiteId = "canal" | "beach";
export type FloorId = "lower" | "upper" | "outdoor";

export type Swatch = {
  id: string;
  name: string;
  role: string;
  token: string;
};

export type Room = {
  id: string;
  title: string;
  floor: FloorId;
  models: ModelId[];
  image: string;
  kicker: string;
  body: string;
  finishes: string[];
  zone: string;
  sites?: Partial<Record<SiteId, Partial<Pick<Room, "title" | "kicker" | "body" | "image" | "finishes">>>>;
};

export type Material = {
  id: string;
  name: string;
  use: string;
  note: string;
};

export const MODELS: Record<
  ModelId,
  { label: string; beds: string; blurb: string }
> = {
  v2: {
    label: "V2 · Two bedroom",
    beds: "2 bed / 2 bath",
    blurb:
      "Open inland lounge for dining and work. Best for a couple, a small family, or longer stays.",
  },
  v3: {
    label: "V3 · Three bedroom",
    beds: "3 bed / 2 bath",
    blurb:
      "Enclosed guest suite at the inland end. Living, kitchen, and dining stay on the water-facing lower floor.",
  },
};

export const SITES: Record<
  SiteId,
  {
    label: string;
    short: string;
    kicker: string;
    hero: string;
    heroAlt: string;
    outdoor: string;
    lots: string;
    blurb: string;
  }
> = {
  canal: {
    label: "Canal lot",
    short: "Canal",
    kicker: "Canal-front · lots 207 / 208",
    hero: "/villa/canal-hero.jpg",
    heroAlt: "Two-story salt-white container villa on a Belize canal at golden hour",
    outdoor: "441 sq ft of decks",
    lots: "¼ acre · canal-front",
    blurb:
      "The same four-module house. Decks at both short ends; the canal terrace is the evening room.",
  },
  beach: {
    label: "Beach lot",
    short: "Beach",
    kicker: "Beach-front · same ¼ acre",
    hero: "/villa/beach-hero.jpg",
    heroAlt: "Two-story salt-white container villa on a Belize beach with a deep teak terrace",
    outdoor: "480 sq ft of decks",
    lots: "¼ acre · beach-front",
    blurb:
      "Same shell, same furniture. A 16 × 14 ft teak terrace with a covered dining room is the outdoor living floor.",
  },
};

export const LOT = {
  acres: "¼ acre",
  area: "≈ 10,890 sq ft",
  typical: "70 × 150 ft planning envelope",
  note: "Moonlight Bay canal lots 207 / 208 and the beach-front lots are the same size. Survey governs; 70 × 150 ft is a typical Consejo quarter-acre.",
  coverage: "House 16 × 40 ft. Beach terrace adds 16 × 14 ft seaward.",
};

export const PALETTE: Swatch[] = [
  { id: "salt", name: "Salt white", role: "Limewash walls, soffits", token: "bg-salt" },
  { id: "sand", name: "Sand linen", role: "Upholstery, decking", token: "bg-sand" },
  { id: "glass", name: "Sea glass", role: "Tile, textiles, glaze", token: "bg-glass" },
  { id: "lagoon", name: "Lagoon", role: "Cabinetry, throws", token: "bg-lagoon" },
  { id: "teak", name: "Oiled teak", role: "Millwork, stairs", token: "bg-teak" },
  { id: "ink", name: "Charcoal steel", role: "Frames, hardware", token: "bg-ink" },
];

export const MATERIALS: Material[] = [
  {
    id: "limewash",
    name: "Mineral limewash",
    use: "Interior walls",
    note: "Warm, breathable, and honest in humid marine air. Salt white with a slight sand undertone.",
  },
  {
    id: "oak",
    name: "Whitewashed oak",
    use: "Floors",
    note: "Wire-brushed boards, matte oil. Reads as driftwood without the grey-coastal cliché.",
  },
  {
    id: "teak",
    name: "Plantation teak",
    use: "Kitchen, baths, stair, decks",
    note: "Oiled, not stained. Same millwork SKU indoors and on the beach terrace so one factory order covers both sitings.",
  },
  {
    id: "linen",
    name: "Belgian linen",
    use: "Sofas, bedding, drapery",
    note: "Loose covers in sand and ivory. Washes well, wrinkles on purpose.",
  },
  {
    id: "rattan",
    name: "Cane and rattan",
    use: "Lighting, chairs, headboards",
    note: "Indoor lounge chairs and outdoor dining chairs are the same rattan family — bulk buy, one finish.",
  },
  {
    id: "stone",
    name: "Honed limestone",
    use: "Counters, wet rooms",
    note: "Pale, matte, and cool underfoot. Paired with teak so the baths feel like a spa, not a yacht.",
  },
  {
    id: "seagrass",
    name: "Seagrass and jute",
    use: "Rugs",
    note: "Layered under slipcovered seating. Grounds the pale floors without adding pattern noise.",
  },
  {
    id: "steel",
    name: "Marine charcoal steel",
    use: "Expressed frames",
    note: "The container’s corners stay visible. Hardware is matte black, not polished chrome.",
  },
];

export const ROOMS: Room[] = [
  {
    id: "living",
    title: "Living toward the water",
    floor: "lower",
    models: ["v2", "v3"],
    image: "/villa/living.jpg",
    kicker: "Lower · water end",
    body: "The joined sixteen-foot width is the whole point. A sand linen sofa and rattan chairs face the sliding glass; the kitchen millwork sits on the long wall so the view stays uninterrupted. No navy-and-anchor kitsch — just limewash, oak, and late light.",
    finishes: ["Salt limewash", "Sand linen", "Seagrass rug", "Teak millwork"],
    zone: "living",
    sites: {
      beach: {
        image: "/villa/beach-living.jpg",
        kicker: "Lower · beach terrace",
        body: "Same sofa, same rattan, same teak kitchen — the sliders now open onto a 16 × 14 ft teak terrace instead of a shallow deck. The living room and the outdoor dining room are one suite, which is the point of a beach lot.",
      },
    },
  },
  {
    id: "kitchen",
    title: "Galley in teak and sea glass",
    floor: "lower",
    models: ["v2", "v3"],
    image: "/villa/kitchen.jpg",
    kicker: "Lower · wet wall",
    body: "A working kitchen in a 16-foot module has to be disciplined. Teak cabinets, honed limestone, and a muted sea-glass backsplash keep it coastal without going cold. Open oak shelves hold the daily ceramics; matte black taps sit against the warm wood. Factory-fitted, identical on canal and beach houses.",
    finishes: ["Oiled teak", "Limestone", "Sea-glass tile", "Matte black"],
    zone: "living",
  },
  {
    id: "dining",
    title: "Canal lounge",
    floor: "lower",
    models: ["v2"],
    image: "/villa/dining.jpg",
    kicker: "V2 · lower canal end",
    body: "In the two-bedroom, the canal end stays open. A teak table, rattan chairs, and a linen daybed make this the work-and-dinner room — the long view through the house to the beach deck, and a short step onto the canal terrace.",
    finishes: ["Teak table", "Rattan", "Linen daybed", "Woven pendants"],
    zone: "canal-room",
    sites: {
      beach: {
        title: "Garden lounge",
        kicker: "V2 · inland end",
        body: "On a beach lot this room faces the garden and the road, not a second water. Same teak table and rattan chairs — dinner can move to the covered beach terrace. The SKUs do not change.",
      },
    },
  },
  {
    id: "guest",
    title: "Guest suite at the canal",
    floor: "lower",
    models: ["v3"],
    image: "/villa/bedroom-guest.jpg",
    kicker: "V3 · lower canal end",
    body: "The three-bedroom closes the canal end into a proper guest room: sage linen, a rattan bench, teak wardrobe, and its own sliding door to the canal deck. Guests get water and privacy; the living floor keeps the social rooms.",
    finishes: ["Sage linen", "Teak wardrobe", "Rattan", "Sea-glass pillows"],
    zone: "canal-room",
    sites: {
      beach: {
        title: "Guest suite at the garden",
        kicker: "V3 · inland end",
        body: "Same guest room, same wardrobe, same linen. On the beach siting it opens to a quiet garden landing instead of the canal. Guests still have privacy; the household lives on the beach terrace.",
      },
    },
  },
  {
    id: "bath",
    title: "Stacked wet rooms",
    floor: "lower",
    models: ["v2", "v3"],
    image: "/villa/bath.jpg",
    kicker: "Both levels · entry core",
    body: "Two shared baths stack on the entry side so plumbing stays in one riser. Limestone, a teak vanity, a glass shower, and a high screened window. Spa, not ship’s head. Fitted at the factory on every shell.",
    finishes: ["Limestone", "Teak vanity", "Glass shower", "Matte black"],
    zone: "bath",
  },
  {
    id: "stair",
    title: "Teak stair, steel stringer",
    floor: "lower",
    models: ["v2", "v3"],
    image: "/villa/stair.jpg",
    kicker: "Central bay",
    body: "A U-stair in oiled teak with a charcoal steel stringer and a slender glass guard. The opening is reserved in the upper floor so Bed 1 still takes the water balcony. Afternoon light drops through the high window onto the treads.",
    finishes: ["Oiled teak", "Charcoal steel", "Glass guard"],
    zone: "stair",
  },
  {
    id: "bed-beach",
    title: "Beach bedroom",
    floor: "upper",
    models: ["v2", "v3"],
    image: "/villa/bedroom-beach.jpg",
    kicker: "Upper · water balcony",
    body: "Ivory linen, a rattan headboard, and a full-width slider onto the balcony. This is the room that sells the house: wake to water, sleep with the doors open behind a gauzy drape.",
    finishes: ["Ivory linen", "Rattan headboard", "Teak nightstands"],
    zone: "bed-beach",
    sites: {
      beach: {
        image: "/villa/beach-balcony.jpg",
        kicker: "Upper · 16 × 10 ft balcony",
        body: "Same bed and rattan headboard. The balcony deepens to ten feet — two chairs, a teak table, and a real morning coffee perch over the bay instead of a toe-hold Juliet.",
      },
    },
  },
  {
    id: "bed-canal",
    title: "Canal bedroom",
    floor: "upper",
    models: ["v2", "v3"],
    image: "/villa/bedroom-canal.jpg",
    kicker: "Upper · canal balcony",
    body: "The quieter of the two uppers. A lagoon-teal throw over ivory sheets, teak wardrobe, and a smaller balcony over the canal. Morning light, not sunset — better for guests or a child’s room that still feels grown.",
    finishes: ["Lagoon linen", "Teak wardrobe", "Woven pendant"],
    zone: "bed-canal",
    sites: {
      beach: {
        title: "Garden bedroom",
        kicker: "Upper · inland balcony",
        body: "Same room, same lagoon throw. On the beach house it looks over the garden and the drive — the quiet bedroom, while Bed 1 takes the sea.",
      },
    },
  },
  {
    id: "balcony",
    title: "Upper balcony",
    floor: "outdoor",
    models: ["v2", "v3"],
    image: "/villa/balcony.jpg",
    kicker: "Outdoor · both ends",
    body: "Glass guards, teak decking, rattan chairs, a single canvas umbrella. The 2026 coastal look that actually photographs: shade, texture, and a long water view — not a wall of outdoor sofas.",
    finishes: ["Teak decking", "Glass guard", "Rattan", "Canvas"],
    zone: "beach-deck",
    sites: {
      beach: {
        image: "/villa/beach-balcony.jpg",
        title: "Beach balcony",
        kicker: "Outdoor · 16 × 10 ft",
        body: "A proper upper terrace, not a ledge. Same rattan chairs and teak as the canal house — just more of the deck. Glass guard, linen cushions, bay for a horizon.",
      },
    },
  },
  {
    id: "deck",
    title: "Lower terrace at dusk",
    floor: "outdoor",
    models: ["v2", "v3"],
    image: "/villa/deck-dusk.jpg",
    kicker: "Outdoor · canal and beach",
    body: "The lower decks are the evening rooms. A low fire bowl, rattan, palms in pots, interior light washing out through the sliders. On lots 207 and 208 the canal terrace is the primary outdoor space.",
    finishes: ["Teak", "Rattan", "Fire bowl", "Potted palms"],
    zone: "canal-deck",
    sites: {
      beach: {
        image: "/villa/beach-deck.jpg",
        title: "Beach terrace",
        kicker: "Outdoor · 16 × 14 ft",
        body: "This is the upgrade. Covered dining under the roof extension — teak table, rattan chairs, ceiling fans — then an open sun apron with a daybed and two steps to the sand. Same furniture family as the living room, so it is one factory purchase, not a second design.",
        finishes: ["Teak terrace", "Rattan dining", "Daybed", "Glass guard"],
      },
    },
  },
];

export const EXTERIORS: Record<
  SiteId,
  { id: string; image: string; title: string; note: string }[]
> = {
  canal: [
    {
      id: "hero",
      image: "/villa/canal-hero.jpg",
      title: "Golden hour on the canal",
      note: "Narrow water, dock, and the four-module stack in the trees.",
    },
    {
      id: "twilight",
      image: "/villa/canal-dusk.jpg",
      title: "Lights on at twilight",
      note: "The glass ends read as lanterns over the canal.",
    },
    {
      id: "aerial",
      image: "/villa/canal-aerial.jpg",
      title: "Canal lot from above",
      note: "Same 16 × 40 ft house on a quarter-acre, canal along the water side.",
    },
    {
      id: "deck",
      image: "/villa/deck-dusk.jpg",
      title: "Canal terrace at dusk",
      note: "The evening room on lots 207 and 208.",
    },
  ],
  beach: [
    {
      id: "hero",
      image: "/villa/beach-hero.jpg",
      title: "On the sand",
      note: "Open bay, pale sand, and the 16 × 14 ft teak terrace.",
    },
    {
      id: "dusk",
      image: "/villa/beach-dusk.jpg",
      title: "Lantern at dusk",
      note: "Covered dining, open sun apron, the sea in front.",
    },
    {
      id: "aerial",
      image: "/villa/beach-aerial.jpg",
      title: "On a quarter-acre",
      note: "House toward the beach third of a 70 × 150 ft lot.",
    },
    {
      id: "deck",
      image: "/villa/beach-deck.jpg",
      title: "The terrace, close",
      note: "Factory teak table and rattan — the indoor SKUs, outdoors.",
    },
  ],
};

export const FACTORY_FIT = [
  {
    id: "fixed",
    title: "Fitted at the factory",
    items: [
      "Teak kitchen millwork, limestone, sea-glass tile",
      "Both stacked baths, vanities, showers",
      "Wardrobes, stair, limewash, oak floors",
      "Lighting, fans, and the electrical panel",
    ],
  },
  {
    id: "packed",
    title: "Packed in the module",
    items: [
      "Sand linen sofa and rattan lounge chairs",
      "Beds, teak tables, rugs, drapery",
      "Outdoor rattan dining set and daybed",
      "Same SKUs for canal houses and beach houses",
    ],
  },
];

export function roomsFor(model: ModelId): Room[] {
  return ROOMS.filter((room) => room.models.includes(model));
}

export function presentRoom(room: Room, site: SiteId): Room {
  const over = room.sites?.[site];
  return over ? { ...room, ...over } : room;
}

export function roomById(id: string, model: ModelId, site: SiteId = "canal"): Room {
  const match = roomsFor(model).find((room) => room.id === id);
  const base = match ?? roomsFor(model)[0];
  return presentRoom(base, site);
}

export function specsFor(site: SiteId) {
  return [
    { label: "Modules", value: "4 × 40 ft high-cube" },
    { label: "Footprint", value: "16 × 40 ft" },
    { label: "Net area", value: "≈ 1,057 sq ft" },
    { label: "Outdoor", value: SITES[site].outdoor },
    { label: "Lot", value: LOT.acres },
    { label: "Siting", value: SITES[site].lots },
  ];
}

export const SPECS = specsFor("canal");

