import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import {
  KITS,
  QUOTE,
  SITEWORK,
  STYLES,
  allInOne,
  groupTotal,
  kitTotal,
  laborFor,
  pairTotal,
  shellSubtotal,
  usd,
  type QuoteStyle,
} from "@/lib/quote";
import { cn } from "@/lib/utils";

export function QuoteStudio() {
  const [sku, setSku] = useState(STYLES[0].id);
  const style = STYLES.find((s) => s.id === sku) ?? STYLES[0];
  const [roomId, setRoomId] = useState(style.rooms[0].id);
  const rooms = style.rooms;
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  const kit = KITS[style.kit];
  const ffe = kitTotal(style.kit);
  const labor = laborFor(style);
  const openLightbox = useStudio((s) => s.openLightbox);

  function pick(next: QuoteStyle) {
    setSku(next.id);
    setRoomId(next.rooms[0].id);
  }

  return (
    <section id="quote" className="bg-salt/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Customer quote · lots 115 & 127</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium text-ink sm:text-5xl">
          Seven factory shells. One Caribbean Salt kit. A 400 sf screened deck on both lots.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Draft for {QUOTE.billTo}. Pick a style — we quote it twice, once per quarter-acre
          lot. Factory is unfurnished; FF&E, the mosquito-screened porch, fence, and set-up
          labor are now priced below.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl bg-ink">
          <button type="button" className="block w-full text-left" onClick={() => openLightbox("/quote/lots-115-127.jpg")}>
            <img
              src="/quote/lots-115-127.jpg"
              alt="Lots 115 and 127, two salt-white homes with screened decks"
              className="aspect-wide w-full object-cover"
            />
          </button>
          <p className="px-5 py-3 text-sm text-salt">{QUOTE.lotNote}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s)}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm",
                s.id === style.id ? "bg-lagoon text-salt" : "bg-paper text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
              )}
            >
              {s.sku} · {s.beds}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-xl bg-ink">
            <img
              src={style.exterior.image}
              alt={style.exterior.title}
              className="aspect-photo w-full cursor-pointer object-cover"
              onClick={() => openLightbox(style.exterior.image)}
            />
            <div className="bg-surface p-5">
              <p className="text-xs tracking-[0.18em] text-teak uppercase">{style.sku}</p>
              <h3 className="mt-1 font-display text-3xl text-ink">
                {style.name} · {style.beds}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{style.exterior.note}</p>
              <p className="mt-3 text-sm text-ink">
                {style.area} · {style.story} · ships {style.ship}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <p className="text-xs tracking-[0.18em] text-teak uppercase">All-in per home</p>
            <p className="mt-2 font-display text-4xl text-ink">{usd(allInOne(style))}</p>
            <p className="mt-1 text-sm text-muted">Pair on lots 115 + 127 · {usd(pairTotal(style))}</p>
            <dl className="mt-6 space-y-2 text-sm">
              {[
                ["Factory shell (unfurnished)", style.factory],
                ["Ocean freight China → Belize", style.freight],
                ["Inland + duties", style.inland],
                ["Slab, excavation, MEP", style.slab],
                ["Hurricane tie-downs", style.tie],
                ["Crane", style.crane],
                ["Subtotal shell", shellSubtotal(style)],
                ["Contingency", 20000],
                ["400 sf screened deck + fence", SITEWORK.exterior],
                [style.story === "Two-story" ? "Labor (stack + set)" : "Labor (set)", labor],
                [`FF&E kit ${style.kit}`, ffe],
              ].map(([label, n]) => (
                <div key={String(label)} className="flex justify-between gap-4">
                  <dt className="text-muted">{label}</dt>
                  <dd className="tabular-nums text-ink">{usd(n as number)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Deck {usd(SITEWORK.deck)} · mosquito screen {usd(SITEWORK.screen)} · rail {usd(SITEWORK.rail)} ·
              wood fence {usd(SITEWORK.fence)}. Working draft — not a contract.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">Rooms · Caribbean Salt</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Inside this style</h3>
          <div className="mt-5 overflow-hidden rounded-xl bg-ink">
            <img
              src={room.image}
              alt={room.name}
              className="aspect-photo w-full cursor-pointer object-cover"
              onClick={() => openLightbox(room.image)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {rooms.map((r) => (
              <Button
                key={r.id}
                type="button"
                size="sm"
                variant={r.id === room.id ? "solid" : "outline"}
                onClick={() => setRoomId(r.id)}
              >
                {r.name}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{room.caption}</p>
        </div>

        <div className="mt-12">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">FF&E BOQ · kit {style.kit}</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Furniture for one home</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Same millwork and loose pieces as the villas so we buy in bulk. Screened-deck
            dining is in every kit — the porch is the same 400 sf on lots 115 and 127.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {kit.map((g) => (
              <article key={g.id} className="rounded-xl bg-surface p-5 shadow-border">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-2xl text-ink">{g.title}</h4>
                  <p className="text-sm tabular-nums text-lagoon">{usd(groupTotal(g))}</p>
                </div>
                <ul className="mt-4 space-y-2">
                  {g.lines.map((l) => (
                    <li key={l.sku} className="flex justify-between gap-3 text-sm">
                      <span className="text-muted">
                        {l.item}
                        <span className="ml-2 text-xs text-teak">{l.sku} ×{l.qty}</span>
                      </span>
                      <span className="tabular-nums text-ink">{usd(l.qty * l.unit)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 font-display text-2xl text-ink">
            FF&E one home {usd(ffe)} · two lots {usd(ffe * 2)}
          </p>
        </div>
      </div>
    </section>
  );
}
