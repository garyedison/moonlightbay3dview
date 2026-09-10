import { FACTORY_FIT } from "@/lib/villa";

export function FactoryFit() {
  return (
    <section id="factory" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">One purchase order</p>
        <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          Buy the furniture once. Fit it at the factory.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Canal houses and beach houses share the Caribbean Salt palette and the
          same FF&E catalogue. Millwork, kitchens, baths, and lighting go in
          before the modules ship. Loose pieces pack in the shell so island labour
          is set-down, not a second build.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {FACTORY_FIT.map((col) => (
          <article key={col.id} className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h3 className="font-display text-2xl text-ink">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lagoon" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
        The beach terrace uses the indoor teak table and rattan chairs, not a
        second outdoor line. Extra dining chairs for the 16 × 14 ft deck are the
        same SKU, ordered as a quantity bump, not a new design.
      </p>
    </section>
  );
}
