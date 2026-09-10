import { PRICE, VALUE, VALUE_PLACES, money, resolvePlace } from "@/lib/cottages";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

function CanalMap({ active, onSelect }: { active: number; onSelect: (lot: number) => void }) {
  return (
    <svg viewBox="0 0 860 210" className="h-auto w-full" role="img" aria-label="Lots 108 to 114 along the inland canal">
      <rect x="6" y="6" width="848" height="198" fill="#efe8dc" stroke="#1c211f" strokeWidth="1.2" />
      <rect x="12" y="16" width="836" height="44" fill="#8aada4" />
      <text x="430" y="36" textAnchor="middle" fill="#1c211f" fontSize="11" letterSpacing="1.6">
        INLAND CANAL · FURTHEST FROM THE OCEAN
      </text>
      <text x="430" y="52" textAnchor="middle" fill="#1c211f" fontSize="8">
        400 sq ft deck · teak steps to kayak put-in
      </text>
      {VALUE_PLACES.map((place, i) => {
        const x = 18 + i * 120;
        const y = 70;
        const on = place.lot === active;
        const c = resolvePlace(place).cottage;
        return (
          <g key={place.lot} className="cursor-pointer" onClick={() => onSelect(place.lot)}>
            <rect x={x} y={y} width="110" height="78" fill={on ? "#2c5854" : "#f3eee4"} stroke="#1c211f" strokeWidth={on ? 2 : 1} />
            <rect x={x + 8} y={y - 8} width="94" height="8" fill="#c4a574" />
            <text x={x + 55} y={y + 22} textAnchor="middle" fill={on ? "#f3eee4" : "#7a5a38"} fontSize="11" fontWeight="600">
              #{place.lot}
            </text>
            <text x={x + 55} y={y + 42} textAnchor="middle" fill={on ? "#f3eee4" : "#1c211f"} fontSize="9">
              {c.name}
            </text>
            <text x={x + 55} y={y + 60} textAnchor="middle" fill={on ? "#d6c4a5" : "#6b6458"} fontSize="8">
              {money(place.furnished)}
            </text>
          </g>
        );
      })}
      <rect x="12" y="160" width="836" height="32" fill="#d6c4a5" />
      <text x="430" y="180" textAnchor="middle" fill="#7a5a38" fontSize="10" letterSpacing="1.4">
        LOTS 103–107 ARE THE MIDDLE 20 × 30 PLANS · SEE LOT CATALOG
      </text>
    </svg>
  );
}

export function CanalValue() {
  const lot = useStudio((s) => s.valueLot);
  const setLot = useStudio((s) => s.setValueLot);
  const openLightbox = useStudio((s) => s.openLightbox);
  const place = VALUE_PLACES.find((p) => p.lot === lot) ?? VALUE_PLACES[0];
  const cottage = resolvePlace(place).cottage;

  return (
    <section id="value" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">{VALUE.kicker}</p>
          <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">{VALUE.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{VALUE.note}</p>
          <p className="mt-3 font-display text-2xl text-ink">Furnished {PRICE.label}</p>
          <p className="mt-4 text-sm">
            <a href="/site-map.html" target="_blank" rel="noreferrer" className="text-lagoon underline underline-offset-2">
              Community site map — July 2026 snapshot
            </a>
            <span className="text-muted">. Lots 108–114 small cottages; 103–107 are the middle 20 × 30 plans in Lot catalog. Confirm with the developer.</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => openLightbox("/cottage/canal-line-k.jpg")}
          className="mt-10 block w-full overflow-hidden rounded-xl text-left"
        >
          <img
            src="/cottage/canal-line-k.jpg"
            alt="Mixed cottages on the inland canal with kayakers, a fisher, and teak steps down to a kayak put-in"
            className="aspect-wide w-full object-cover"
          />
        </button>
        <p className="mt-3 text-sm text-muted">
          Mixed models on the bank. Kayaks on the canal, someone fishing, teak steps down the 5 ft drop to put in and paddle to the ocean.
        </p>
        <button
          type="button"
          onClick={() => openLightbox("/cottage/canal-row-k.jpg")}
          className="mt-4 block w-full overflow-hidden rounded-xl text-left"
        >
          <img
            src="/cottage/canal-row-k.jpg"
            alt="Aerial of mixed cottages on lots 103 to 114 along the inland canal"
            className="aspect-wide w-full object-cover"
          />
        </button>

        <figure className="mt-10 overflow-x-auto rounded-xl bg-surface p-4 shadow-border sm:p-6">
          <figcaption className="mb-3 text-xs tracking-[0.18em] text-teak uppercase">Lots 103 – 114 · tap a lot</figcaption>
          <div className="min-w-[640px]">
            <CanalMap active={lot} onSelect={setLot} />
          </div>
          <p className="mt-3 text-xs text-muted">
            Diagrammatic. Each lot is a quarter-acre. Models are mixed on purpose so the canal street is not a clone row.
          </p>
        </figure>

        <div className="mt-6 flex flex-wrap gap-2">
          {VALUE_PLACES.map((p) => (
            <button
              key={p.lot}
              type="button"
              onClick={() => setLot(p.lot)}
              className={cn(
                "min-h-11 rounded-full px-3 text-xs tracking-wide",
                p.lot === lot ? "bg-lagoon text-salt" : "bg-surface text-ink shadow-border",
              )}
            >
              #{p.lot}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <button
            type="button"
            onClick={() => openLightbox(cottage.canalImage)}
            className="overflow-hidden rounded-xl text-left"
          >
            <img
              src={cottage.canalImage}
              alt={`${cottage.name} on lot ${place.lot} with a 400 square-foot canal deck`}
              className="aspect-photo w-full object-cover"
            />
          </button>
          <div>
            <p className="text-xs tracking-[0.18em] text-teak uppercase">
              Lot {place.lot} · {cottage.code} · canal view
            </p>
            <h3 className="mt-2 font-display text-3xl text-ink">{cottage.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {cottage.blurb} On this lot the outdoor room is a 400 sq ft teak deck at a 5 ft drop to the inland canal. A couple of the houses get a walkway with steps down to a kayak landing — carry the boat to the water and paddle out to the bay.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Furnished</dt>
                <dd className="mt-1 font-display text-2xl text-ink">{money(place.furnished)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Canal deck</dt>
                <dd className="mt-1 font-display text-2xl text-ink">400 sf · 5 ft drop</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Beds</dt>
                <dd className="mt-1 text-sm text-muted">{cottage.beds}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Lot</dt>
                <dd className="mt-1 text-sm text-muted">¼ acre · inland canal</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted">
              Furnished {PRICE.label} for every house in this row. Same FF&E and MEP kit as Gate row, bought in bulk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
