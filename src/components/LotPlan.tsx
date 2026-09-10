import { LOT, SITES } from "@/lib/villa";
import { useStudio } from "@/lib/store";

export function LotPlan() {
  const site = useStudio((s) => s.site);
  const beach = site === "beach";

  return (
    <section id="lot" className="bg-salt/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">Quarter-acre lots</p>
          <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
            Every lot is the same size.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {LOT.note} The house does not grow. The beach siting spends the extra
            outdoor room on a deep terrace instead of a second water deck.
          </p>
          <p className="mt-5">
            <a
              href="/site-map.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-lagoon px-4 text-sm text-salt"
            >
              Open the community site map
            </a>
          </p>
          <p className="mt-2 text-xs text-muted">
            Snapshot from July 2026. Other lots may already be sold — check with
            the developer for the current map and what is available.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <figure className="rounded-xl bg-surface p-5 shadow-border sm:p-8">
            <svg viewBox="0 0 220 360" className="h-auto w-full" aria-hidden="true">
              <rect x="18" y="18" width="184" height="324" fill="#efe8dc" stroke="#1c211f" strokeWidth="1.2" />
              <text x="110" y="36" textAnchor="middle" fill="#7a5a38" fontSize="9" letterSpacing="2">
                {beach ? "ROAD" : "ROAD"}
              </text>
              <rect x="78" y="48" width="28" height="70" fill="#d6c4a5" />
              <text x="92" y="88" textAnchor="middle" fill="#6b6458" fontSize="7">
                drive
              </text>
              <rect x="70" y={beach ? 128 : 118} width="80" height="28" fill="#d6c4a5" stroke="#1c211f" strokeWidth="0.6" />
              <text x="110" y={beach ? 146 : 136} textAnchor="middle" fill="#1c211f" fontSize="7">
                {beach ? "landing 6 ft" : "landing 6 ft"}
              </text>
              <rect x="70" y={beach ? 156 : 146} width="80" height="100" fill="#f3eee4" stroke="#1c211f" strokeWidth="1.4" />
              <line x1="110" y1={beach ? 156 : 146} x2="110" y2={beach ? 256 : 246} stroke="#b42318" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="110" y={beach ? 210 : 200} textAnchor="middle" fill="#1c211f" fontSize="9" fontWeight="600">
                16 × 40 ft
              </text>
              <text x="110" y={beach ? 222 : 212} textAnchor="middle" fill="#6b6458" fontSize="7">
                four modules
              </text>
              <rect
                x="70"
                y={beach ? 256 : 246}
                width="80"
                height={beach ? 52 : 28}
                fill="#c4a574"
                stroke="#1c211f"
                strokeWidth="0.8"
              />
              <text x="110" y={beach ? 286 : 264} textAnchor="middle" fill="#1c211f" fontSize="7">
                {beach ? "terrace 16 × 14 ft" : "canal terrace"}
              </text>
              <rect x="18" y="318" width="184" height="24" fill={beach ? "#8aada4" : "#d6c4a5"} />
              <text x="110" y="334" textAnchor="middle" fill="#1c211f" fontSize="8" letterSpacing="1.5">
                {beach ? "BAY / BEACH" : "CANAL"}
              </text>
            </svg>
            <figcaption className="mt-4 text-xs text-muted">
              {LOT.typical} · {LOT.area} · {SITES[site].label}
            </figcaption>
          </figure>

          <dl className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-xs tracking-[0.16em] text-teak uppercase">Lot</dt>
              <dd className="mt-2 font-display text-2xl text-ink">{LOT.acres}</dd>
              <p className="mt-1 text-sm text-muted">{LOT.area}</p>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] text-teak uppercase">Envelope</dt>
              <dd className="mt-2 font-display text-2xl text-ink">70 × 150 ft</dd>
              <p className="mt-1 text-sm text-muted">Typical Consejo quarter-acre. Survey governs.</p>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] text-teak uppercase">House</dt>
              <dd className="mt-2 font-display text-2xl text-ink">1,057 sq ft</dd>
              <p className="mt-1 text-sm text-muted">Same net interior on canal and beach.</p>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] text-teak uppercase">Outdoor</dt>
              <dd className="mt-2 font-display text-2xl text-ink">{SITES[site].outdoor}</dd>
              <p className="mt-1 text-sm text-muted">{LOT.coverage}</p>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
