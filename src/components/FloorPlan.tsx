import { useStudio } from "@/lib/store";
import { MODELS, SITES, roomById } from "@/lib/villa";
import { cn } from "@/lib/utils";

type Zone = {
  id: string;
  label: string;
  roomId: string;
  deck?: boolean;
  className?: string;
};

function zones(site: "canal" | "beach", model: "v2" | "v3") {
  const inlandDeck = "Garden landing";
  const inlandRoom =
    model === "v3"
      ? "Guest bedroom"
      : site === "beach"
        ? "Garden lounge"
        : "Dining lounge";
  const inlandRoomId = model === "v3" ? "guest" : "dining";
  const waterDeck = site === "beach" ? "Beach terrace 16 × 14 ft" : "Canal terrace";
  const inlandBalcony = "Garden balcony";
  const inlandBed = "Bed 2 · garden";
  const waterBed = site === "beach" ? "Bed 1 · beach" : "Bed 1 · canal";
  const waterBalcony = site === "beach" ? "Beach balcony 16 × 10 ft" : "Canal balcony";

  const lower: Zone[] = [
    { id: "inland-deck", label: inlandDeck, roomId: inlandRoomId, deck: true },
    { id: "inland-room", label: inlandRoom, roomId: inlandRoomId },
    { id: "stair", label: "Stair", roomId: "stair" },
    { id: "bath", label: "Bath", roomId: "bath" },
    { id: "living", label: "Living / kitchen", roomId: "living" },
    { id: "water-deck", label: waterDeck, roomId: "deck", deck: true },
  ];
  const upper: Zone[] = [
    { id: "inland-deck", label: inlandBalcony, roomId: "bed-canal", deck: true },
    { id: "bed-inland", label: inlandBed, roomId: "bed-canal" },
    { id: "stair", label: "Landing", roomId: "stair" },
    { id: "bath", label: "Bath", roomId: "bath" },
    { id: "bed-water", label: waterBed, roomId: "bed-beach" },
    { id: "water-deck", label: waterBalcony, roomId: "balcony", deck: true },
  ];
  return { lower, upper };
}

function ZoneButton({
  zone,
  active,
  onSelect,
}: {
  zone: Zone;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(zone.roomId)}
      aria-pressed={active}
      className={cn(
        "flex min-h-11 items-center justify-center rounded-sm px-2 text-center text-xs font-medium transition-colors duration-150",
        active && "bg-lagoon text-salt",
        !active && zone.deck && "bg-sand text-ink hover:bg-glass/70",
        !active && !zone.deck && "bg-surface text-ink hover:bg-salt",
      )}
    >
      {zone.label}
    </button>
  );
}

function Plan({
  title,
  zones: planZones,
  activeRoom,
  onSelect,
  site,
}: {
  title: string;
  zones: Zone[];
  activeRoom: string;
  onSelect: (id: string) => void;
  site: "canal" | "beach";
}) {
  const deckTop = planZones[0];
  const endRoom = planZones[1];
  const stair = planZones[2];
  const bath = planZones[3];
  const front = planZones[4];
  const deckBottom = planZones[5];
  const beachHeavy = site === "beach" && title.startsWith("Lower");

  return (
    <figure className="rounded-xl bg-salt p-4 shadow-border sm:p-6">
      <figcaption className="mb-3 flex items-center justify-between">
        <span className="text-xs tracking-[0.18em] text-teak uppercase">{title}</span>
        <span className="text-xs text-muted">16 × 40 ft shell</span>
      </figcaption>
      <p className="mb-2 text-center text-xs tracking-[0.22em] text-teak">ROAD / GARDEN</p>
      <div
        className={cn(
          "grid gap-1.5 rounded-md bg-ink/10 p-1.5",
          beachHeavy
            ? "grid-rows-[auto_minmax(4.5rem,1fr)_auto_minmax(5.5rem,1.2fr)_minmax(4.5rem,auto)]"
            : "grid-rows-[auto_minmax(4.5rem,1fr)_auto_minmax(5.5rem,1.2fr)_auto]",
        )}
      >
        <ZoneButton zone={deckTop} active={activeRoom === deckTop.roomId} onSelect={onSelect} />
        <ZoneButton zone={endRoom} active={activeRoom === endRoom.roomId} onSelect={onSelect} />
        <div className="grid grid-cols-2 gap-1.5">
          <ZoneButton zone={stair} active={activeRoom === stair.roomId} onSelect={onSelect} />
          <ZoneButton zone={bath} active={activeRoom === bath.roomId} onSelect={onSelect} />
        </div>
        <ZoneButton zone={front} active={activeRoom === front.roomId} onSelect={onSelect} />
        <ZoneButton zone={deckBottom} active={activeRoom === deckBottom.roomId} onSelect={onSelect} />
      </div>
      <p className="mt-2 text-center text-xs tracking-[0.22em] text-teak">
        {site === "beach" ? "BEACH" : "CANAL"}
      </p>
    </figure>
  );
}

export function FloorPlan() {
  const model = useStudio((s) => s.model);
  const site = useStudio((s) => s.site);
  const roomId = useStudio((s) => s.roomId);
  const setRoom = useStudio((s) => s.setRoom);
  const room = roomById(roomId, model, site);
  const { lower, upper } = zones(site, model);

  function selectZone(id: string) {
    setRoom(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("rooms")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section id="plans" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Schematic plans</p>
        <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          {MODELS[model].label}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {SITES[site].blurb} Interior partitions, kitchen, baths, and stair do not
          change between canal and beach — that is how the furniture buys in bulk.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Plan title="Lower floor" zones={lower} activeRoom={room.id} onSelect={selectZone} site={site} />
        <Plan title="Upper floor" zones={upper} activeRoom={room.id} onSelect={selectZone} site={site} />
      </div>

      <p className="mt-6 text-xs text-muted">
        Concept layout. Room sizes are planning envelopes, not certified finish
        dimensions. Beach terrace 4,876 × 4,267 mm; upper balcony 4,876 × 3,048 mm.
      </p>
    </section>
  );
}
