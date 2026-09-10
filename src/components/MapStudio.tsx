import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ARCH,
  FEATURED_LOTS,
  LOTS,
  SITE,
  WORLD,
  ZONE_LABEL,
  counts,
  lotArchetype,
  type Kind,
  type Zone,
} from "@/lib/community";
import { downloadCommunityPdf, downloadCommunitySvg } from "@/lib/community-pdf";
import { cn } from "@/lib/utils";

const stats = counts();

export function MapStudio() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [zone, setZone] = useState<Zone | "all">("all");
  const [hover, setHover] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return LOTS.filter((lot) => {
      const arch = lotArchetype(lot);
      if (filter !== "all" && arch.kind !== filter) return false;
      if (zone !== "all" && lot.zone !== zone) return false;
      if (query && !String(lot.n).includes(query.trim())) return false;
      return true;
    });
  }, [filter, zone, query]);

  const hovered = hover != null ? LOTS.find((l) => l.n === hover) : undefined;
  const hoverArch = hovered ? lotArchetype(hovered) : undefined;

  const pad = 8;
  const w = WORLD.width + 24;
  const d = WORLD.depth + 28;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-xl">
            Moonlight Bay
          </Link>
          <nav className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/3d">Room films</Link>
            </Button>
            <Button type="button" size="sm" onClick={downloadCommunityPdf}>
              <Download className="size-4" />
              Download PDF
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Built-out plat</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Site map with a home on every lot.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {stats.total} houses — {stats.steel} steel container, {stats.wood} wood — on the Consejo plat.
          Canal runs north–south on the west bank (mangrove beyond), then a south arm into Chetumal Bay
          on the east. Click a lot to walk it in 3D and open the kitchen, living room, and bedrooms.
          Gold numbers are featured beach, canal, gate, park, and street pins. Not a survey.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "steel", "wood"] as const).map((id) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setFilter(id)}
              className={cn("rounded-full", filter === id && "bg-lagoon text-salt hover:bg-lagoon")}
            >
              {id === "all" ? "All homes" : id === "steel" ? "Steel only" : "Wood only"}
            </Button>
          ))}
          {(
            [
              ["all", "Every zone"],
              ["beach", "Beach"],
              ["canal", "Canal"],
              ["gate", "Gate"],
              ["park", "Park"],
              ["street", "Street"],
              ["interior", "Interior"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setZone(id)}
              className={cn("rounded-full", zone === id && "bg-ink text-salt hover:bg-ink")}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-surface shadow-border">
          <svg viewBox={`${-pad} ${-8} ${w} ${d}`} className="h-auto w-full bg-salt">
            <rect x={SITE.bayX} y={-8} width={SITE.bayW} height={WORLD.depth + 16} fill="#4e8f9c" />
            <text
              x={SITE.bayX + 18}
              y={WORLD.depth / 2}
              fill="#faf7f1"
              fontSize="5"
              fontFamily="Georgia, serif"
              transform={`rotate(90 ${SITE.bayX + 18} ${WORLD.depth / 2})`}
            >
              CHETUMAL BAY
            </text>
            <rect x={SITE.mangroveX - 4} y={-2} width={SITE.mangroveW + 2} height={WORLD.depth + 4} fill="#3a5536" />
            <rect x={SITE.canalX - SITE.canalW / 2} y={4} width={SITE.canalW} height={WORLD.depth - 10} fill="#3e7a86" />
            <rect x={SITE.canalX} y={WORLD.depth - 10} width={WORLD.width * 0.7} height="16" fill="#3e7a86" />
            <text x={SITE.canalX} y={WORLD.depth * 0.4} fill="#faf7f1" fontSize="4" textAnchor="middle" fontFamily="Georgia, serif">
              CANAL
            </text>
            <rect x={8 * 8.2} y={7 * 11.4} width="16" height="14" fill="#7a9a6a" />
            <rect x={13.5 * 8.2} y={4 * 11.4} width="14" height="14" fill="#7a9a6a" />
            <rect x={13 * 8.2} y={11 * 11.4} width="28" height="16" fill="#7a9a6a" />
            <rect x={4.2 * 8.2} y="8" width="6.5" height={WORLD.depth * 0.72} fill="#b7a585" />
            {visible.map((lot) => {
              const arch = lotArchetype(lot);
              const featured = FEATURED_LOTS.has(lot.n);
              const bw = Math.max(3.2, arch.w * 0.85);
              const bd = Math.max(2.6, arch.d * 0.22);
              return (
                <g
                  key={lot.n}
                  className="cursor-pointer"
                  onClick={() => navigate({ to: "/3d" })}
                  onPointerEnter={() => setHover(lot.n)}
                  onPointerLeave={() => setHover((n) => (n === lot.n ? null : n))}
                >
                  <rect
                    x={lot.x - bw / 2}
                    y={lot.z - bd / 2}
                    width={bw}
                    height={bd}
                    rx="0.4"
                    fill={lot.n === hover ? "#e8a13a" : arch.kind === "steel" ? "#2c5854" : "#7a5a38"}
                  >
                    <title>{`Lot ${lot.n} · ${arch.name}`}</title>
                  </rect>
                  {featured && (
                    <text
                      x={lot.x}
                      y={lot.z + 0.8}
                      textAnchor="middle"
                      fill="#faf7f1"
                      fontSize="2.4"
                      fontFamily="system-ui"
                      className="pointer-events-none"
                    >
                      {lot.n}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 bg-lagoon" /> Steel container
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block size-3 bg-teak" /> Wood home
          </span>
          <span>{visible.length} lots shown</span>
          {hovered && hoverArch && (
            <span className="text-ink">
              Lot {hovered.n} · {hoverArch.name} · {ZONE_LABEL[hovered.zone]} · {hoverArch.beds}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={downloadCommunityPdf}>
            <Download className="size-4" />
            PDF with lot schedule
          </Button>
          <Button type="button" variant="outline" onClick={downloadCommunitySvg}>
            Download SVG
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/3d" })}
          >
            <Shuffle className="size-4" />
            Watch room films
          </Button>
          <a href="/site-map.html" className="inline-flex min-h-11 items-center px-3 text-sm text-lagoon underline">
            July 2026 availability tracker
          </a>
        </div>

        <form className="mt-8 max-w-sm" onSubmit={(e) => e.preventDefault()}>
          <label className="text-xs tracking-[0.16em] text-teak uppercase">Find a lot</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lot number"
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-salt px-4 text-sm"
            inputMode="numeric"
          />
        </form>

        <section className="mt-10 pb-16">
          <h2 className="font-display text-3xl">Models on the plat</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.values(ARCH).map((arch) => (
              <article key={arch.id} className="rounded-lg bg-surface p-5 shadow-border">
                <p className="text-xs tracking-[0.16em] text-teak uppercase">
                  {arch.kind === "steel" ? "Container steel" : "Wood"} · {stats.byArch[arch.id] ?? 0} lots
                </p>
                <h3 className="mt-1 font-display text-2xl">{arch.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  {arch.size} · {arch.beds} · {arch.area}
                </p>
                <p className="mt-2 text-sm text-muted">{arch.plan.map((r) => r.name).join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
