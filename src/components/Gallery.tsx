import { EXTERIORS, SITES, specsFor } from "@/lib/villa";
import { useStudio } from "@/lib/store";

export function Gallery() {
  const site = useStudio((s) => s.site);
  const openLightbox = useStudio((s) => s.openLightbox);
  const shots = EXTERIORS[site];
  const specs = specsFor(site);

  return (
    <section id="exteriors" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-teak uppercase">Outside</p>
        <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          {site === "beach" ? "The villa as it sits on the bay." : "The villa as it sits on the canal."}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {SITES[site].blurb} Pale marine coating, charcoal frames, glass guards, and
          a ventilated over-roof. Same building on every quarter-acre lot.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => openLightbox(shots[0].image)}
          className="overflow-hidden rounded-xl text-left md:col-span-2"
        >
          <img
            src={shots[0].image}
            alt={shots[0].title}
            className="aspect-wide w-full object-cover"
          />
        </button>
        {shots.slice(1).map((shot) => (
          <button
            key={shot.id}
            type="button"
            onClick={() => openLightbox(shot.image)}
            className="overflow-hidden rounded-xl text-left"
          >
            <img src={shot.image} alt={shot.title} className="aspect-photo w-full object-cover" />
            <span className="mt-3 block font-display text-2xl text-ink">{shot.title}</span>
            <span className="mt-1 block text-sm text-muted">{shot.note}</span>
          </button>
        ))}
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-3 lg:grid-cols-6">
        {specs.map((spec) => (
          <div key={spec.label}>
            <dt className="text-xs tracking-[0.16em] text-teak uppercase">{spec.label}</dt>
            <dd className="mt-2 font-display text-xl text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
