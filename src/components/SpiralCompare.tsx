import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import {
  COMPARE_ROWS,
  HIP_STYLE,
  KITS,
  LOWER_ZONES,
  PRICE,
  SPIRAL_FILMS,
  SPIRAL_ROOF_FFE,
  SPIRAL_SITE,
  SPIRAL_SPECS,
  SPIRAL_STYLE,
  SPIRAL_TOUR,
  UPPER_ZONES,
  allInOne,
  ffeFor,
  groupTotal,
  hipVsSpiral,
  spiralBreakdown,
  usd,
} from "@/lib/spiral";
import { cn } from "@/lib/utils";

export function SpiralCompare() {
  const openLightbox = useStudio((s) => s.openLightbox);
  const { hip, spiral, hipTotal, spiralTotal, delta } = hipVsSpiral();
  const [pick, setPick] = useState<"spiral" | "hip">("spiral");
  const style = pick === "spiral" ? spiral : hip;
  const rooms = pick === "spiral" ? SPIRAL_TOUR : style.rooms;
  const [roomId, setRoomId] = useState(rooms[0].id);
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];
  const [filmId, setFilmId] = useState(SPIRAL_FILMS[0].id);
  const film = SPIRAL_FILMS.find((f) => f.id === filmId) ?? SPIRAL_FILMS[0];
  const [planFloor, setPlanFloor] = useState<1 | 2>(1);
  const kit = KITS.L;
  const lines = spiralBreakdown(SPIRAL_STYLE);

  function choose(next: "spiral" | "hip") {
    setPick(next);
    const nextRooms = next === "spiral" ? SPIRAL_TOUR : HIP_STYLE.rooms;
    setRoomId(nextRooms[0].id);
  }

  return (
    <section id="lot-115-look" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Lot 115 · customer look</p>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium text-ink sm:text-5xl">
          The cedar spiral house, beside the hip-roof we already quoted.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Same quarter-acre canal lot. Same Caribbean Salt furniture. The new option keeps the
          customer exterior — cedar lap, rust container end, black spiral, open 400 sf teak deck —
          and fits our kitchen, living, and bedrooms inside. Two bed, two bath, one up and one down.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-xl bg-ink">
            <button type="button" className="block w-full text-left" onClick={() => openLightbox("/quote/spiral/exterior.jpg")}>
              <img src="/quote/spiral/exterior.jpg" alt="Cedar spiral-deck container on the Lot 115 canal bank" className="aspect-wide w-full object-cover" />
            </button>
            <div className="bg-surface p-5">
              <p className="text-xs tracking-[0.18em] text-teak uppercase">Customer look · Lot 115</p>
              <h3 className="mt-1 font-display text-3xl text-ink">{SPIRAL_STYLE.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{SPIRAL_STYLE.exterior.note}</p>
              <p className="mt-3 font-display text-3xl text-ink">{usd(spiralTotal)}</p>
              <p className="text-sm text-muted">All-in furnished on Lot 115 · {SPIRAL_STYLE.beds} · {SPIRAL_STYLE.area}</p>
            </div>
          </article>
          <article className="overflow-hidden rounded-xl bg-ink">
            <button type="button" className="block w-full text-left" onClick={() => openLightbox(HIP_STYLE.exterior.image)}>
              <img src={HIP_STYLE.exterior.image} alt="Salt-white hip-roof bungalow previously quoted on Lot 115" className="aspect-wide w-full object-cover" />
            </button>
            <div className="bg-surface p-5">
              <p className="text-xs tracking-[0.18em] text-teak uppercase">Previous quote · Lot 115</p>
              <h3 className="mt-1 font-display text-3xl text-ink">{HIP_STYLE.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{HIP_STYLE.exterior.note}</p>
              <p className="mt-3 font-display text-3xl text-ink">{usd(hipTotal)}</p>
              <p className="text-sm text-muted">All-in furnished · {HIP_STYLE.beds} · {HIP_STYLE.area}</p>
            </div>
          </article>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-surface shadow-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 font-medium text-muted">On Lot 115</th>
                <th className="px-4 py-3 font-medium text-ink">{SPIRAL_STYLE.name}</th>
                <th className="px-4 py-3 font-medium text-ink">{HIP_STYLE.name}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line">
                  <td className="px-4 py-3 text-muted">{row.label}</td>
                  <td className="px-4 py-3 text-ink">{row.spiral}</td>
                  <td className="px-4 py-3 text-ink">{row.hip}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 text-muted">All-in furnished</td>
                <td className="px-4 py-3 font-medium text-lagoon">{usd(spiralTotal)}</td>
                <td className="px-4 py-3 font-medium text-ink">{usd(hipTotal)}</td>
              </tr>
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-muted">
            The spiral house is {usd(delta)} more. Extra enclosed floor, second-story bath, cedar cladding,
            spiral stair, and a roof deck. Lot cost is separate. Working draft — not a contract.
          </p>
        </div>

        <div className="mt-14">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">3D walk · inside and outside</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Walk the house on Lot 115</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Planning films of this shell with the factory furniture set — not a captured Matterport of a built house.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl bg-ink shadow-border">
            <video
              key={film.src}
              src={film.src}
              poster={film.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="aspect-video w-full object-cover"
            >
              Your browser cannot play this walkthrough.
            </video>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SPIRAL_FILMS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilmId(f.id)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-sm",
                  f.id === film.id ? "bg-lagoon text-salt" : "bg-salt text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{film.caption}</p>
          <div className="mt-5">
            <Button asChild className="min-h-11">
              <a href="/3d?lot=115">Open Lot 115 in the 3D walk</a>
            </Button>
          </div>
        </div>

        <div className="mt-14">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">Layout · 16 × 32 ft</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Two floors. Bath down, bath up.</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Living opens west to the canal. Guest bedroom and bath 1 sit inland on grade. Primary and bath 2
            sit over the inland half. The roof deck sits over the living room.
          </p>
          <div className="mt-5 flex gap-2">
            <Button type="button" size="sm" variant={planFloor === 1 ? "solid" : "outline"} onClick={() => setPlanFloor(1)}>
              Lower
            </Button>
            <Button type="button" size="sm" variant={planFloor === 2 ? "solid" : "outline"} onClick={() => setPlanFloor(2)}>
              Upper
            </Button>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl bg-surface p-4 shadow-border sm:p-6">
            <SpiralPlan floor={planFloor} active={roomId} onSelect={setRoomId} />
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SPIRAL_SPECS.map(([k, v]) => (
              <li key={k} className="flex justify-between gap-4 rounded-lg bg-salt px-4 py-3 text-sm">
                <span className="text-muted">{k}</span>
                <span className="text-right text-ink">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">Rooms · factory furniture in this shell</p>
          <h3 className="mt-2 font-display text-3xl text-ink">Same kit. This house.</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("spiral")}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm",
                pick === "spiral" ? "bg-lagoon text-salt" : "bg-salt text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
              )}
            >
              Customer look
            </button>
            <button
              type="button"
              onClick={() => choose("hip")}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm",
                pick === "hip" ? "bg-lagoon text-salt" : "bg-salt text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
              )}
            >
              Previous hip-roof
            </button>
          </div>
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
              <Button key={r.id} type="button" size="sm" variant={r.id === room.id ? "solid" : "outline"} onClick={() => setRoomId(r.id)}>
                {r.name}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{room.caption}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs tracking-[0.2em] text-teak uppercase">Quote · Lot 115 only</p>
            <h3 className="mt-2 font-display text-3xl text-ink">All-in to build the spiral house</h3>
            <p className="mt-2 text-sm text-muted">
              Factory two-story container, customized with a second bath, cedar cladding, spiral stair, and roof deck.
              Caribbean Salt FF&E fitted before ship.
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              {lines.map(([label, n]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className={label.startsWith("Subtotal") ? "text-ink" : "text-muted"}>{label}</dt>
                  <dd className="tabular-nums text-ink">{usd(n)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-display text-4xl text-ink">{usd(allInOne(SPIRAL_STYLE))}</p>
            <p className="mt-1 text-sm text-muted">
              Deck {usd(SPIRAL_SITE.deck)} · roof deck {usd(SPIRAL_SITE.roof)} · cable rail {usd(SPIRAL_SITE.rail)} ·
              fence {usd(SPIRAL_SITE.fence)}. Lot not included.
            </p>
          </div>
          <aside className="rounded-xl bg-surface p-6 shadow-border">
            <p className="text-xs tracking-[0.18em] text-teak uppercase">FF&E · kit L + roof</p>
            <p className="mt-2 font-display text-2xl text-ink">
              {usd(ffeFor(SPIRAL_STYLE))} installed
            </p>
            <ul className="mt-4 space-y-3">
              {kit.map((g) => (
                <li key={g.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted">{g.title}</span>
                  <span className="tabular-nums text-ink">{usd(groupTotal(g))}</span>
                </li>
              ))}
              <li className="flex justify-between gap-3 text-sm">
                <span className="text-muted">Roof-deck Adirondacks + planters</span>
                <span className="tabular-nums text-ink">{usd(SPIRAL_ROOF_FFE)}</span>
              </li>
              <li className="flex justify-between gap-3 text-sm">
                <span className="text-muted">Fully furnished / install</span>
                <span className="tabular-nums text-ink">{usd(PRICE.ffeFurnished)}</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SpiralPlan({
  floor,
  active,
  onSelect,
}: {
  floor: 1 | 2;
  active: string;
  onSelect: (id: string) => void;
}) {
  const zones = floor === 1 ? LOWER_ZONES : UPPER_ZONES;
  return (
    <svg viewBox="0 0 320 340" className="h-auto w-full" role="img" aria-label={floor === 1 ? "Lower floor plan" : "Upper floor plan"}>
      <rect x="8" y="8" width="304" height="324" fill="#efe8dc" stroke="#1c211f" strokeWidth="1.2" />
      <text x="160" y="28" textAnchor="middle" fill="#7a5a38" fontSize="10" letterSpacing="2">
        {floor === 1 ? "CANAL · WEST" : "ROOF DECK OVER LIVING"}
      </text>
      {zones.map((z) => {
        const on = z.id === active;
        const fill = z.floor === "deck" || z.id === "roof" ? "#d6c4a5" : on ? "#2c5854" : "#fffdf8";
        const ink = on && z.floor !== "deck" && z.id !== "roof" ? "#f3eee4" : "#1c211f";
        return (
          <g key={z.id} role="button" tabIndex={0} onClick={() => onSelect(z.id)} style={{ cursor: "pointer" }}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              fill={fill}
              stroke="#1c211f"
              strokeWidth={on ? 1.8 : 1}
            />
            <text x={z.x + z.w / 2} y={z.y + z.h / 2 - 4} textAnchor="middle" fill={ink} fontSize="9" fontWeight="600">
              {z.name}
            </text>
            <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 10} textAnchor="middle" fill={ink} fontSize="7">
              {z.note.split(".")[0]}
            </text>
          </g>
        );
      })}
      <text x="160" y="328" textAnchor="middle" fill="#6b6458" fontSize="8">
        16 × 32 ft footprint · ¼ acre lot · 20 ft canal setback
      </text>
    </svg>
  );
}
