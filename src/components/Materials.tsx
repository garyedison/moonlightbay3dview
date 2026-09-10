import { MATERIALS } from "@/lib/villa";
import { useStudio } from "@/lib/store";

export function Materials() {
  const openLightbox = useStudio((s) => s.openLightbox);

  return (
    <section id="materials" className="bg-ink py-16 text-salt sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <button
            type="button"
            onClick={() => openLightbox("/villa/materials.jpg")}
            className="overflow-hidden rounded-xl text-left"
          >
            <img
              src="/villa/materials.jpg"
              alt="Material still life of linen, teak, limestone, sea-glass textile and steel"
              className="aspect-still w-full object-cover"
            />
          </button>
          <div>
            <p className="text-xs tracking-[0.2em] text-sand uppercase">Finish board</p>
            <h2 className="mt-3 font-display text-4xl font-medium text-salt sm:text-5xl">
              Texture does the work colour used to do.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-sand">
              Limewash, linen, rattan, teak, and one cool stone. The same board
              outfits the canal house and the beach house so millwork and loose
              furniture can be bought in bulk and fitted before the modules leave
              the factory.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg bg-lagoon/30 sm:grid-cols-2">
          {MATERIALS.map((item) => (
            <li key={item.id} className="bg-ink p-5 sm:p-6">
              <p className="text-xs tracking-[0.16em] text-glass uppercase">{item.use}</p>
              <h3 className="mt-2 font-display text-2xl text-salt">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand">{item.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
