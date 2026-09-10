import { BANDS, type BandId, bandById, houseOn } from "@/lib/neighborhood";
import { money } from "@/lib/cottages";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Plan({ beds, size, water }: { beds: string; size: string; water: string }) {
  const three = beds.startsWith("3");
  const one = beds.startsWith("1");
  const studio = beds.toLowerCase().includes("studio") || beds.toLowerCase().includes("loft");
  return (
    <svg viewBox="0 0 280 140" className="h-auto w-full" aria-hidden="true">
      <rect x="8" y="8" width="264" height="124" fill="#efe8dc" stroke="#1c211f" strokeWidth="1.2" />
      <rect x="8" y="8" width="264" height="18" fill="#8aada4" />
      <text x="140" y="20" textAnchor="middle" fill="#1c211f" fontSize="8" letterSpacing="1.2">
        {water.toUpperCase()}
      </text>
      {studio ? (
        <>
          <rect x="20" y="36" width="160" height="84" fill="#f3eee4" stroke="#1c211f" strokeWidth="1" />
          <text x="100" y="80" textAnchor="middle" fill="#1c211f" fontSize="10">
            live / sleep
          </text>
          <rect x="180" y="36" width="80" height="84" fill="#d6c4a5" stroke="#1c211f" strokeWidth="1" />
          <text x="220" y="80" textAnchor="middle" fill="#1c211f" fontSize="9">
            bath + kit
          </text>
        </>
      ) : (
        <>
          <rect x="20" y="36" width="110" height="84" fill="#f3eee4" stroke="#1c211f" strokeWidth="1" />
          <text x="75" y="78" textAnchor="middle" fill="#1c211f" fontSize="10">
            living / kitchen
          </text>
          <rect x="130" y="36" width="70" height={three ? 40 : 84} fill="#f3eee4" stroke="#1c211f" strokeWidth="1" />
          <text x="165" y={three ? 58 : 78} textAnchor="middle" fill="#1c211f" fontSize="9">
            bed 1
          </text>
          {three ? (
            <rect x="130" y="76" width="70" height="44" fill="#f3eee4" stroke="#1c211f" strokeWidth="1" />
          ) : null}
          {three ? (
            <text x="165" y="100" textAnchor="middle" fill="#1c211f" fontSize="9">
              bed 3
            </text>
          ) : null}
          {one ? (
            <rect x="200" y="36" width="60" height="84" fill="#d6c4a5" stroke="#1c211f" strokeWidth="1" />
          ) : (
            <rect x="200" y="36" width="60" height="50" fill="#f3eee4" stroke="#1c211f" strokeWidth="1" />
          )}
          <text x="230" y={one ? 78 : 64} textAnchor="middle" fill="#1c211f" fontSize="9">
            {one ? "bath" : "bed 2"}
          </text>
          {one ? null : (
            <rect x="200" y="86" width="60" height="34" fill="#d6c4a5" stroke="#1c211f" strokeWidth="1" />
          )}
          {one ? null : (
            <text x="230" y="106" textAnchor="middle" fill="#1c211f" fontSize="8">
              bath
            </text>
          )}
        </>
      )}
      <text x="140" y="132" textAnchor="middle" fill="#7a5a38" fontSize="8">
        {size} · original Moonlight Bay layout · not a factory tracing
      </text>
    </svg>
  );
}

export function Neighborhood() {
  const bandId = useStudio((s) => s.neighBand);
  const lot = useStudio((s) => s.neighLot);
  const setBand = useStudio((s) => s.setNeighBand);
  const setLot = useStudio((s) => s.setNeighLot);
  const openLightbox = useStudio((s) => s.openLightbox);
  const band = bandById(bandId);
  const house = houseOn(band, lot);

  return (
    <section id="lots" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-teak uppercase">Lot catalog · mixed plans</p>
          <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
            Big on the bay. Small on the street.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Four bands on the July 2026 map. 20 × 40 on beach lots 196–199, 20 × 30 on canal lots
            103–107, 20 × 34 on park lots 234–239, and the small 16-foot plans on 241 and 252–259.
            Styles are mixed on every row — not a clone street. Same furniture kit as the villas.
            Confirm lot status with the developer.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {BANDS.map((b) => (
            <Button
              key={b.id}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setBand(b.id as BandId)}
              className={cn(
                "h-10 rounded-full px-4 text-xs tracking-wide",
                band.id === b.id && "bg-ink text-salt hover:bg-ink",
              )}
              aria-pressed={band.id === b.id}
            >
              {b.title}
            </Button>
          ))}
        </div>

        <p className="mt-6 text-xs tracking-[0.2em] text-teak uppercase">{band.kicker}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{band.note}</p>
        <p className="mt-2 font-display text-2xl text-ink">Furnished {band.price}</p>

        <button
          type="button"
          onClick={() => openLightbox(band.row)}
          className="mt-8 block w-full overflow-hidden rounded-xl text-left"
        >
          <img src={band.row} alt={`${band.title} mixed house styles`} className="aspect-wide w-full object-cover" />
        </button>
        <p className="mt-3 text-sm text-muted">Mixed models on this row. Tap a lot for the house and a simple plan.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {band.houses.map((h) => (
            <button
              key={h.lot}
              type="button"
              onClick={() => setLot(h.lot)}
              className={cn(
                "min-h-11 rounded-full px-3 text-sm",
                h.lot === house.lot ? "bg-lagoon text-salt" : "bg-salt text-ink",
              )}
            >
              #{h.lot}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <button type="button" onClick={() => openLightbox(house.image)} className="overflow-hidden rounded-xl text-left">
            <img src={house.image} alt={`${house.name} on lot ${house.lot}`} className="aspect-wide w-full object-cover" />
          </button>
          <div>
            <p className="text-xs tracking-[0.2em] text-teak uppercase">Lot {house.lot}</p>
            <h3 className="mt-2 font-display text-3xl text-ink">{house.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{house.blurb}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Plan</dt>
                <dd className="mt-1 font-medium">{house.size}</dd>
              </div>
              <div>
                <dt className="text-muted">Beds</dt>
                <dd className="mt-1 font-medium">{house.beds}</dd>
              </div>
              <div>
                <dt className="text-muted">Area</dt>
                <dd className="mt-1 font-medium">{house.area}</dd>
              </div>
              <div>
                <dt className="text-muted">Furnished</dt>
                <dd className="mt-1 font-medium">{money(house.furnished)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Style</dt>
                <dd className="mt-1 font-medium">
                  {house.style} · {house.cladding}
                </dd>
              </div>
            </dl>
            <div className="mt-6 rounded-xl bg-salt p-3">
              <Plan beds={house.beds} size={house.size} water={band.water} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
