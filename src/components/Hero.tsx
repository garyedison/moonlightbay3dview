import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MODELS, SITES } from "@/lib/villa";
import { useStudio } from "@/lib/store";

export function Hero() {
  const model = useStudio((s) => s.model);
  const site = useStudio((s) => s.site);
  const meta = MODELS[model];
  const place = SITES[site];

  return (
    <section id="top" className="relative">
      <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <button
          type="button"
          onClick={() => document.getElementById("exteriors")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative block w-full overflow-hidden rounded-xl text-left"
        >
          <img
            src={place.hero}
            alt={place.heroAlt}
            className="aspect-photo w-full object-cover sm:aspect-wide"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <p className="text-xs tracking-[0.2em] text-sand uppercase">
              Moonlight Bay de Consejo · {place.kicker}
            </p>
            <h1 className="mt-2 max-w-xl font-display text-4xl font-medium text-salt sm:text-6xl">
              {site === "beach" ? "The terrace is the living room." : "The house on the canal."}
            </h1>
          </div>
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              Four 40-foot high-cubes, about 1,057 sq ft inside, on a quarter-acre
              lot. Canal and beach houses share one shell, one Caribbean Salt
              palette, and one FF&E order — fitted at the factory, shipped as a
              house.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-surface p-5 shadow-border">
            <p className="text-xs tracking-[0.18em] text-teak uppercase">
              {place.label} · {meta.label}
            </p>
            <p className="font-display text-2xl text-ink">{meta.beds}</p>
            <p className="text-sm leading-relaxed text-muted">{place.blurb}</p>
            <a
              href="/3d"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-lagoon px-4 text-sm text-salt"
            >
              3D walk of the whole community
            </a>
            <a
              href="/map"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.16)]"
            >
              Site map + PDF
            </a>
            <Button asChild size="md" className="mt-1 w-fit">
              <a href="#rooms">
                Walk the rooms
                <ArrowDown className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
