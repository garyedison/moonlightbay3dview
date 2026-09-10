import { useState } from "react";
import { ROOM_FILMS, INTERIORS_REEL } from "@/lib/room-films";
import { cn } from "@/lib/utils";

export function RoomFilms() {
  const [active, setActive] = useState(ROOM_FILMS[0].id);
  const film = ROOM_FILMS.find((r) => r.id === active) ?? ROOM_FILMS[0];

  return (
    <section id="films" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs tracking-[0.2em] text-teak uppercase">Interior films</p>
      <h2 className="mt-2 max-w-2xl font-display text-4xl font-medium sm:text-5xl">
        Walk each room the same way as the island video.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Slow pans through kitchen, living, dining, both bedrooms, and the bath.
        Same furniture kit in every house — we film the rooms, not a 3D model.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl bg-ink shadow-border">
        <video
          key={film.src}
          src={film.src}
          poster={film.poster}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full object-cover"
        >
          Your browser cannot play this room film.
        </video>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ROOM_FILMS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActive(r.id)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm",
              r.id === active ? "bg-lagoon text-salt" : "bg-salt text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
            )}
          >
            {r.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{film.caption}</p>

      <div className="mt-10">
        <p className="text-xs tracking-[0.18em] text-teak uppercase">Full interior walk</p>
        <h3 className="mt-2 font-display text-2xl">Kitchen through bath, one take</h3>
        <div className="mt-4 overflow-hidden rounded-xl bg-ink shadow-border">
          <video
            src={INTERIORS_REEL}
            poster="/villa/kitchen.jpg"
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          >
            Your browser cannot play this walkthrough.
          </video>
        </div>
      </div>
    </section>
  );
}
