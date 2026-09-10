import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Home, Link2, Map as MapIcon, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARCH, LOTS, LOT_BY_N, WORLD, ZONE_LABEL, counts, lotArchetype, randomLotN } from "@/lib/community";
import { downloadCommunityPdf, downloadCommunitySvg } from "@/lib/community-pdf";
import { cn } from "@/lib/utils";
import { exteriorFor, tourFor, photoForRoom, tourRoom } from "@/lib/tours";
import type { Kind } from "@/lib/community";
import type { WalkApi, WalkMode } from "@/lib/walk-engine";

const stats = counts();

export function WalkStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<WalkApi | null>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<WalkMode>("dollhouse");
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [selected, setSelected] = useState<number | null>(196);
  const [query, setQuery] = useState("");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let api: WalkApi | null = null;
    void import("@/lib/walk-engine").then(({ mountWalk }) => {
      if (disposed || !canvasRef.current) return;
      api = mountWalk(canvasRef.current);
      apiRef.current = api;
      api.onChange(() => {
        setSelected(api?.getSelected() ?? null);
        setMode(api?.getMode() ?? "dollhouse");
        setFloor(api?.getFloor() ?? 1);
        setRooms(api?.getRooms() ?? []);
        setActiveRoom(api?.getActiveRoom() ?? null);
      });
      setReady(true);
      const params = new URLSearchParams(window.location.search);
      const n = Number(params.get("lot"));
      if (params.get("tour") === "1") {
        setStarted(true);
        api.playTour();
      } else if (Number.isFinite(n) && LOT_BY_N.has(n)) {
        setStarted(true);
        setSelected(n);
        api.enterLot(n);
      }
    });
    return () => {
      disposed = true;
      api?.dispose();
      apiRef.current = null;
    };
  }, []);

  const lot = selected != null ? LOT_BY_N.get(selected) : undefined;
  const arch = lot ? lotArchetype(lot) : undefined;

  function share3d() {
    const url = new URL("/3d", window.location.origin);
    if (selected != null) url.searchParams.set("lot", String(selected));
    void navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    });
  }

  function goMode(next: WalkMode) {
    apiRef.current?.setMode(next);
    setMode(next);
  }

  function goFilter(next: "all" | Kind) {
    apiRef.current?.setFilter(next);
    setFilter(next);
  }

  function jump(n: number, enter = true) {
    if (!LOT_BY_N.has(n)) return;
    setSelected(n);
    if (enter) {
      apiRef.current?.enterLot(n);
      setMode("inside");
    } else {
      apiRef.current?.focusLot(n);
    }
  }

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-ink text-salt">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" style={{ touchAction: "none" }} />

      {!started && (
        <div className="absolute inset-0 z-20 flex items-end bg-ink/45 p-4 sm:items-center sm:justify-center sm:p-8">
          <div className="max-w-lg rounded-xl bg-paper p-6 text-ink shadow-border">
            <p className="text-xs tracking-[0.2em] text-teak uppercase">Moonlight Bay 3D view</p>
            <h1 className="mt-2 font-display text-4xl font-medium">Walk the community. Look inside 360°.</h1>
            <img
              src="/site/peninsula-aerial.jpg"
              alt="Beach cottages and mangrove canal at Moonlight Bay"
              className="mt-4 h-36 w-full rounded-lg object-cover"
            />
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Play the auto flythrough — gate, canal, beach, then kitchen and bedrooms — or click any
              house and drag to look around. This is a planning 3D tour with factory room photos, not a
              captured Matterport of 260 unique shells.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" onClick={() => setStarted(true)} disabled={!ready} className="min-h-11">
                {ready ? "Start walking" : "Loading 3D…"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!ready}
                className="min-h-11"
                onClick={() => {
                  setStarted(true);
                  apiRef.current?.playTour();
                }}
              >
                Play community tour
              </Button>
              <Button type="button" variant="outline" onClick={downloadCommunityPdf} className="min-h-11">
                <Download className="size-4" />
                Download PDF map
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link to="/map">
                  <MapIcon className="size-4" />
                  Open 2D plat
                </Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">
              Inside a home: drag to look 360°, A/D to turn, room chips to jump. Escape back to the street.
            </p>
          </div>
        </div>
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        <Link to="/" className="pointer-events-auto rounded-full bg-paper/90 px-4 py-2 font-display text-lg text-ink">
          Moonlight Bay
        </Link>
        <div className="pointer-events-auto flex flex-wrap gap-1 rounded-full bg-paper/90 p-1">
          {(["dollhouse", "ground", "inside"] as const).map((id) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => goMode(id)}
              className={cn("h-9 rounded-full px-3 text-xs", mode === id && "bg-ink text-salt hover:bg-ink")}
            >
              {id === "dollhouse" ? "Dollhouse" : id === "ground" ? "Walk" : "Inside"}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={share3d}
            className="h-9 rounded-full px-3 text-xs"
          >
            <Link2 className="size-3.5" />
            {copied ? "Copied" : "Copy 3D link"}
          </Button>
        </div>
      </header>

      <aside className="pointer-events-none absolute bottom-0 left-0 z-10 w-full max-w-md p-3 sm:p-4">
        <div className="pointer-events-auto rounded-xl bg-paper/95 p-4 text-ink shadow-border">
          <button
            type="button"
            className="mb-2 text-xs tracking-[0.16em] text-teak uppercase"
            onClick={() => setOpenCard((v) => !v)}
          >
            {openCard ? "Hide panel" : "Show lot"}
          </button>
          {openCard && (
            <>
              <div className="flex gap-1">
                {(["all", "steel", "wood"] as const).map((id) => (
                  <Button
                    key={id}
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => goFilter(id)}
                    className={cn("h-9 flex-1 rounded-full text-xs", filter === id && "bg-lagoon text-salt hover:bg-lagoon")}
                  >
                    {id === "all" ? "All" : id === "steel" ? "Steel" : "Wood"}
                  </Button>
                ))}
              </div>
              {lot && arch ? (
                <div className="mt-3">
                  <p className="text-xs tracking-[0.16em] text-teak uppercase">
                    Lot {lot.n} · {ZONE_LABEL[lot.zone]}
                  </p>
                  <h2 className="mt-1 font-display text-2xl">{arch.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {arch.kind === "steel" ? "Container steel" : "Wood"} · {arch.size} · {arch.beds} · {arch.area}
                  </p>
                  {(() => {
                    const tour = tourFor(arch.id, lot.zone);
                    const shown =
                      mode === "inside"
                        ? photoForRoom(activeRoom ?? "living", arch.id, lot.zone)
                        : exteriorFor(lot.n, arch.id);
                    const cap =
                      mode === "inside"
                        ? (tourRoom(activeRoom ?? "living", arch.id, lot.zone)?.caption ??
                          "Same Caribbean Salt furniture kit in every house.")
                        : lot.zone === "canal"
                          ? "On dry land. Deck faces the west canal — 5 ft bank down to the water."
                          : lot.zone === "beach"
                            ? "East-facing Chetumal Bay. Same house, bigger terrace."
                            : "Factory shell with the shared furniture kit.";
                    return (
                      <>
                        <img
                          src={shown}
                          alt={mode === "inside" ? (activeRoom ?? "Room") : `Lot ${lot.n} exterior`}
                          className="mt-3 h-32 w-full rounded-lg object-cover sm:h-40"
                        />
                        <p className="mt-1 text-xs leading-relaxed text-muted">{cap}</p>
                        {mode === "inside" && (
                          <p className="mt-1 text-xs text-teak">Drag to look 360°. A/D turns. Room chips jump.</p>
                        )}
                      </>
                    );
                  })()}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mode !== "inside" ? (
                      <Button type="button" size="sm" className="min-h-11" onClick={() => jump(lot.n)}>
                        <Home className="size-4" />
                        Enter home
                      </Button>
                    ) : (
                      <Button type="button" size="sm" variant="outline" className="min-h-11" onClick={() => apiRef.current?.exitHouse()}>
                        Back to street
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => jump(randomLotN(lot.n))}
                    >
                      <Shuffle className="size-4" />
                      Random home
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="min-h-11" onClick={() => jump(103, false)}>
                      Canal 103
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="min-h-11" onClick={() => jump(196, false)}>
                      Beach 196
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="min-h-11" onClick={() => jump(330, false)}>
                      Gate 330
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => apiRef.current?.playTour()}
                    >
                      Play tour
                    </Button>
                  </div>
                  {mode === "inside" && arch.stories === 2 && (
                    <div className="mt-3 flex gap-1">
                      {([1, 2] as const).map((f) => (
                        <Button
                          key={f}
                          type="button"
                          size="sm"
                          variant="ghost"
                          className={cn("h-9 flex-1 rounded-full text-xs", floor === f && "bg-ink text-salt hover:bg-ink")}
                          onClick={() => apiRef.current?.setFloor(f)}
                        >
                          Floor {f}
                        </Button>
                      ))}
                    </div>
                  )}
                  {mode === "inside" && lot && arch && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {(rooms.length ? rooms : tourFor(arch.id, lot.zone)).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={cn(
                            "min-w-[4.5rem] rounded-lg border border-line text-left",
                            activeRoom === r.id && "ring-2 ring-lagoon",
                          )}
                          onClick={() => apiRef.current?.goRoom(r.id)}
                        >
                          <img
                            src={photoForRoom(r.id, arch.id, lot.zone)}
                            alt=""
                            className="h-12 w-full rounded-t-lg object-cover"
                          />
                          <span className="block px-1.5 py-1 text-[10px] leading-tight">{r.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">Click a house on the plat to inspect it.</p>
              )}
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const n = Number(query);
                  if (Number.isFinite(n)) jump(n);
                }}
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to lot #"
                  className="min-h-11 flex-1 rounded-full border border-line bg-salt px-3 text-sm"
                  inputMode="numeric"
                />
                <Button type="submit" size="sm" variant="outline" className="min-h-11">
                  Go
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={downloadCommunityPdf}>
                  <Download className="size-4" />
                  PDF map
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={downloadCommunitySvg}>
                  SVG
                </Button>
                <Link to="/map" className="inline-flex min-h-11 items-center px-3 text-xs text-lagoon underline">
                  2D plat
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>

      <div className="pointer-events-none absolute right-3 top-16 hidden w-48 rounded-xl bg-paper/90 p-2 text-ink sm:block">
        <p className="px-1 text-[10px] tracking-[0.16em] text-teak uppercase">Minimap · click a lot</p>
        <Minimap
          selected={selected}
          onPick={(n) => {
            apiRef.current?.focusLot(n);
            setSelected(n);
          }}
        />
      </div>

      {started && (mode === "ground" || mode === "inside") && (
        <Stick onVec={(x, z) => apiRef.current?.setMove(x, z)} />
      )}
    </div>
  );
}

function Minimap({ selected, onPick }: { selected: number | null; onPick: (n: number) => void }) {
  return (
    <svg viewBox={`0 0 ${WORLD.cols + 1} ${WORLD.rows}`} className="pointer-events-auto mt-1 h-auto w-full">
      <rect width={WORLD.cols + 1} height={WORLD.rows} fill="#d6c4a5" />
      <rect x="0" y="0" width="2.4" height={WORLD.rows} fill="#3a5536" />
      <rect x="1.4" y="0.4" width="1.5" height={WORLD.rows - 1.2} fill="#3e7a86" />
      <rect x={WORLD.cols - 3.2} y="0" width="4" height={WORLD.rows} fill="#4e8f9c" />
      <text x="21.2" y="8" fill="#faf7f1" fontSize="0.9" transform="rotate(-90 21.2 8)">
        BAY
      </text>
      <text x="1.7" y="8" fill="#faf7f1" fontSize="0.7" transform="rotate(-90 1.7 8)">
        CANAL
      </text>
      {LOTS.map((lot) => {
        const arch = ARCH[lot.arch];
        const c = lot.x / WORLD.colW;
        const r = lot.z / WORLD.rowD;
        return (
          <rect
            key={lot.n}
            x={c - 0.35}
            y={r - 0.3}
            width="0.7"
            height="0.55"
            fill={selected === lot.n ? "#e8a13a" : arch.kind === "steel" ? "#2c5854" : "#7a5a38"}
            className="cursor-pointer"
            onClick={() => onPick(lot.n)}
          >
            <title>{`Lot ${lot.n}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function Stick({ onVec }: { onVec: (x: number, z: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = false;
    const setFrom = (clientX: number, clientY: number) => {
      const b = el.getBoundingClientRect();
      const x = (clientX - (b.left + b.width / 2)) / (b.width / 2);
      const y = (clientY - (b.top + b.height / 2)) / (b.height / 2);
      const nx = Math.max(-1, Math.min(1, x));
      const nz = Math.max(-1, Math.min(1, y));
      onVec(nx, nz);
      if (knob.current) {
        knob.current.style.transform = `translate(calc(-50% + ${nx * 28}px), calc(-50% + ${nz * 28}px))`;
      }
    };
    const down = (e: PointerEvent) => {
      active = true;
      el.setPointerCapture(e.pointerId);
      setFrom(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!active) return;
      setFrom(e.clientX, e.clientY);
    };
    const up = () => {
      active = false;
      onVec(0, 0);
      if (knob.current) knob.current.style.transform = "translate(-50%, -50%)";
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      onVec(0, 0);
    };
  }, [onVec]);

  return (
    <div className="pointer-events-none absolute right-4 bottom-28 z-10 sm:bottom-8">
      <div
        ref={ref}
        className="pointer-events-auto relative size-24 rounded-full bg-paper/70 shadow-border"
        style={{ touchAction: "none" }}
      >
        <div
          ref={knob}
          className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lagoon"
        />
      </div>
    </div>
  );
}
