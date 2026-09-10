import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import type { LaneId } from "@/lib/cottages";
import type { SiteId } from "@/lib/villa";
import { cn } from "@/lib/utils";

const LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "#palette", label: "Palette" },
  { href: "#rooms", label: "Rooms" },
  { href: "#plans", label: "Plans" },
  { href: "#lots", label: "Lots" },
  { href: "#gate", label: "Gate" },
  { href: "#value", label: "Canal value" },
  { href: "/map", label: "Plat" },
  { href: "/3d", label: "3D view" },
  { href: "/site-map.html", label: "July 2026", external: true },
  { href: "#exteriors", label: "Outside" },
];

function go(hash: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(hash)?.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

export function SiteHeader() {
  const model = useStudio((s) => s.model);
  const site = useStudio((s) => s.site);
  const lane = useStudio((s) => s.lane);
  const setModel = useStudio((s) => s.setModel);
  const setSite = useStudio((s) => s.setSite);
  const setLane = useStudio((s) => s.setLane);

  function pickVilla(next: SiteId) {
    setSite(next);
    go("top");
  }

  function pickLane(next: LaneId, hash: string) {
    setLane(next);
    go(hash);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
            Moonlight Bay
          </span>
        </a>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
          <div className="flex rounded-full bg-salt p-1 shadow-[0_0_0_1px_rgba(28,33,31,0.08)]">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => pickVilla("beach")}
              className={cn(
                "h-9 rounded-full px-3 text-xs tracking-wide",
                lane === "villas" && site === "beach" && "bg-lagoon text-salt hover:bg-lagoon",
              )}
              aria-pressed={lane === "villas" && site === "beach"}
            >
              Beach
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => pickVilla("canal")}
              className={cn(
                "h-9 rounded-full px-3 text-xs tracking-wide",
                lane === "villas" && site === "canal" && "bg-lagoon text-salt hover:bg-lagoon",
              )}
              aria-pressed={lane === "villas" && site === "canal"}
            >
              Canal
            </Button>
          </div>
          <div className="flex rounded-full bg-salt p-1 shadow-[0_0_0_1px_rgba(28,33,31,0.08)]">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => pickLane("gate", "gate")}
              className={cn(
                "h-9 rounded-full px-3 text-xs tracking-wide",
                lane === "gate" && "bg-ink text-salt hover:bg-ink",
              )}
              aria-pressed={lane === "gate"}
            >
              Gate
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => pickLane("value", "value")}
              className={cn(
                "h-9 rounded-full px-3 text-xs tracking-wide",
                lane === "value" && "bg-ink text-salt hover:bg-ink",
              )}
              aria-pressed={lane === "value"}
            >
              Canal value
            </Button>
          </div>
          {lane === "villas" && (
            <div className="flex rounded-full bg-salt p-1 shadow-[0_0_0_1px_rgba(28,33,31,0.08)]">
              {(["v2", "v3"] as const).map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setModel(id)}
                  className={cn(
                    "h-9 rounded-full px-3 text-xs tracking-wide",
                    model === id && "bg-ink text-salt hover:bg-ink",
                  )}
                  aria-pressed={model === id}
                >
                  {id === "v2" ? "2 bed" : "3 bed"}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 lg:justify-center">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
            className="shrink-0 rounded-sm px-3 py-1.5 text-sm text-muted transition-colors duration-150 hover:text-ink"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
