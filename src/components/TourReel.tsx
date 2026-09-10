export function TourReel() {
  return (
    <section id="tour" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-teak uppercase">Video + 3D walkthrough</p>
      <h2 className="mt-2 max-w-2xl font-display text-4xl font-medium sm:text-5xl">
        Fly the whole gated community, then look around inside a home.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        A one-minute video from the gate, along the west canal, to Chetumal Bay — then the living
        room, kitchen, and bedroom. The 3D tour uses the same rooms: click a lot, enter, drag to
        look 360°. Same furniture kit in every house.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl bg-ink shadow-border">
        <video
          src="/tour/community.mp4"
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
          href="/3d?tour=1"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lagoon px-5 text-sm text-salt"
        >
          Play 3D Matterport tour
        </a>
        <a
          href="/3d"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.16)]"
        >
          Walk any lot yourself
        </a>
        <a
          href="/moonlightbay3dview"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.16)]"
        >
          moonlightbay3dview
        </a>
      </div>
    </section>
  );
}
