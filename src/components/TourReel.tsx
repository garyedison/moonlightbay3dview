import { COMMUNITY_REEL } from "@/lib/room-films";

export function TourReel() {
  return (
    <section id="tour" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-teak uppercase">Video walkthrough</p>
      <h2 className="mt-2 max-w-2xl font-display text-4xl font-medium sm:text-5xl">
        Fly the gated community, then walk the rooms.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Gate to west canal to Chetumal Bay. Then the same camera language inside:
        kitchen, living, dining, bedrooms, bath. No 3D model — just the films.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl bg-ink shadow-border">
        <video
          src={COMMUNITY_REEL}
          poster="/site/peninsula-aerial.jpg"
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full object-cover"
        >
          Your browser cannot play this walkthrough.
        </video>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="#films"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lagoon px-5 text-sm text-salt"
        >
          Watch the rooms
        </a>
        <a
          href="/3d"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.16)]"
        >
          Room films
        </a>
      </div>
    </section>
  );
}
