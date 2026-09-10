const SWATCHES = [
  { name: "Salt white", role: "Limewash walls, soffits", swatch: "bg-salt" },
  { name: "Sand linen", role: "Upholstery, decking", swatch: "bg-sand" },
  { name: "Sea glass", role: "Tile, textiles, glaze", swatch: "bg-glass" },
  { name: "Lagoon", role: "Cabinetry, throws", swatch: "bg-lagoon" },
  { name: "Oiled teak", role: "Millwork, stairs", swatch: "bg-teak" },
  { name: "Charcoal steel", role: "Frames, hardware", swatch: "bg-ink" },
] as const;

export function Palette() {
  return (
    <section id="palette" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Caribbean Salt</p>
        <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          A beach palette that is warm, not nautical.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Designers have retired the navy-and-white yacht look. What is photographing
          now is weathered teak, mineral whites, sea-glass sage, and one deep lagoon
          note. Canal and beach houses share this palette so furniture is one order.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SWATCHES.map((item) => (
          <figure
            key={item.name}
            className="overflow-hidden rounded-lg bg-surface shadow-border"
          >
            <div className={`h-28 sm:h-36 ${item.swatch}`} />
            <figcaption className="p-3">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="mt-1 text-xs text-muted">{item.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
