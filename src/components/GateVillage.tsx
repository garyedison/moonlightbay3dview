import { COTTAGE_KIT, COTTAGE_MEP, GATE, GATE_PLACES, PRICE, money, resolvePlace } from "@/lib/cottages";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";

function GateMap({ active, onSelect }: { active: number; onSelect: (lot: number) => void }) {
  return (
    <svg viewBox="0 0 860 230" className="h-auto w-full" role="img" aria-label="Gate row lots along the entrance road">
      <rect x="6" y="6" width="848" height="218" fill="#efe8dc" stroke="#1c211f" strokeWidth="1.2" />
      <rect x="12" y="22" width="78" height="118" fill="#1c211f" />
      <text x="51" y="70" textAnchor="middle" fill="#f3eee4" fontSize="11" letterSpacing="1.4">
        GATE
      </text>
      <text x="51" y="90" textAnchor="middle" fill="#d6c4a5" fontSize="8">
        entrance
      </text>
      {GATE_PLACES.map((place, i) => {
        const x = 102 + i * 106;
        const on = place.lot === active;
        const c = resolvePlace(place).cottage;
        return (
          <g key={place.lot} className="cursor-pointer" onClick={() => onSelect(place.lot)}>
            <rect x={x} y="22" width="98" height="118" fill={on ? "#2c5854" : "#f3eee4"} stroke="#1c211f" strokeWidth={on ? 2 : 1} />
            <text x={x + 49} y="48" textAnchor="middle" fill={on ? "#f3eee4" : "#7a5a38"} fontSize="11" fontWeight="600">
              #{place.lot}
            </text>
            <text x={x + 49} y="70" textAnchor="middle" fill={on ? "#f3eee4" : "#1c211f"} fontSize="9">
              {c.name}
            </text>
            <text x={x + 49} y="90" textAnchor="middle" fill={on ? "#d6c4a5" : "#6b6458"} fontSize="8">
              {c.beds}
            </text>
            <text x={x + 49} y="110" textAnchor="middle" fill={on ? "#d6c4a5" : "#6b6458"} fontSize="8">
              {money(place.furnished)}
            </text>
          </g>
        );
      })}
      <rect x="12" y="150" width="836" height="42" fill="#d6c4a5" />
      <text x="430" y="176" textAnchor="middle" fill="#7a5a38" fontSize="11" letterSpacing="2">
        ENTRANCE ROAD — PASSES EVERY HOUSE
      </text>
      <text x="430" y="210" textAnchor="middle" fill="#6b6458" fontSize="8">
        First house is lot 330, beside the gate · ¼ acre lots · furnished {PRICE.label}
      </text>
    </svg>
  );
}

export function GateVillage() {
  const lot = useStudio((s) => s.gateLot);
  const setLot = useStudio((s) => s.setGateLot);
  const openLightbox = useStudio((s) => s.openLightbox);
  const place = GATE_PLACES.find((p) => p.lot === lot) ?? GATE_PLACES[0];
  const cottage = resolvePlace(place).cottage;

  return (
    <section id="gate" className="bg-salt/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">{GATE.kicker}</p>
          <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">{GATE.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{GATE.note}</p>
          <p className="mt-3 font-display text-2xl text-ink">Furnished {PRICE.label}</p>
          <p className="mt-4 text-sm">
            <a href="/site-map.html" target="_blank" rel="noreferrer" className="text-lagoon underline underline-offset-2">
              Community site map — July 2026 snapshot
            </a>
            <span className="text-muted">. Confirm lot status with the developer; others may have sold.</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => openLightbox("/cottage/gate-street-k.jpg")}
          className="mt-10 block w-full overflow-hidden rounded-xl text-left"
        >
          <img
            src="/cottage/gate-street-k.jpg"
            alt="Gated entrance beside the first cottage, with the road continuing past the row"
            className="aspect-wide w-full object-cover"
          />
        </button>
        <p className="mt-3 text-sm text-muted">
          {GATE.walk}. Gate beside lot 330, then a mix of models down 315, 314, 169, 168, 167, and 165.
        </p>

        <figure className="mt-10 overflow-x-auto rounded-xl bg-surface p-4 shadow-border sm:p-6">
          <figcaption className="mb-3 text-xs tracking-[0.18em] text-teak uppercase">Tap a lot along the road</figcaption>
          <div className="min-w-[640px]">
            <GateMap active={lot} onSelect={setLot} />
          </div>
        </figure>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <button
            type="button"
            onClick={() => openLightbox(cottage.image)}
            className="overflow-hidden rounded-xl text-left"
          >
            <img src={cottage.image} alt={`${cottage.name} on lot ${place.lot}`} className="aspect-photo w-full object-cover" />
          </button>
          <div>
            <p className="text-xs tracking-[0.18em] text-teak uppercase">
              Lot {place.lot} · {cottage.code}
            </p>
            <h3 className="mt-2 font-display text-3xl text-ink">{cottage.name}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{cottage.blurb}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Furnished</dt>
                <dd className="mt-1 font-display text-2xl text-ink">{money(place.furnished)}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Beds</dt>
                <dd className="mt-1 font-display text-2xl text-ink">{cottage.beds}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Interior</dt>
                <dd className="mt-1 text-sm text-muted">{cottage.area}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.16em] text-teak uppercase">Skin</dt>
                <dd className="mt-1 text-sm text-muted">{cottage.cladding}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted">Range for the row: furnished {PRICE.label}. Quarter-acre lots.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h3 className="font-display text-2xl text-ink">One furniture order</h3>
            <ul className="mt-5 space-y-3">
              {COTTAGE_KIT.map((row) => (
                <li key={row.item} className="border-t border-line pt-3">
                  <p className="text-sm text-ink">{row.item}</p>
                  <p className="text-xs text-muted">{row.note}</p>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h3 className="font-display text-2xl text-ink">One MEP kit</h3>
            <ul className="mt-5 space-y-3">
              {COTTAGE_MEP.map((row) => (
                <li key={row} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lagoon" />
                  {row}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
