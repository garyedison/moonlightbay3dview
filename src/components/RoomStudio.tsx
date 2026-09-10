import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { filmFor } from "@/lib/room-films";
import { presentRoom, roomById, roomsFor } from "@/lib/villa";
import { useStudio } from "@/lib/store";

export function RoomStudio() {
  const model = useStudio((s) => s.model);
  const site = useStudio((s) => s.site);
  const roomId = useStudio((s) => s.roomId);
  const setRoom = useStudio((s) => s.setRoom);
  const openLightbox = useStudio((s) => s.openLightbox);
  const rooms = roomsFor(model).map((room) => presentRoom(room, site));
  const room = roomById(roomId, model, site);
  const index = rooms.findIndex((r) => r.id === room.id);

  function step(delta: number) {
    const next = rooms[(index + delta + rooms.length) % rooms.length];
    setRoom(next.id);
  }

  return (
    <section id="rooms" className="bg-salt/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-teak uppercase">Interior walkthrough</p>
            <h2 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
              Inside the villa
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Canal and beach houses use the same rooms and the same furniture.
            Only the terrace and the view change.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative overflow-hidden rounded-xl bg-ink">
            {filmFor(room.id) ? (
              <video
                key={filmFor(room.id)}
                src={filmFor(room.id)}
                poster={room.image}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="aspect-still w-full object-cover sm:aspect-photo"
              />
            ) : (
              <img
                src={room.image}
                alt={room.title}
                className="aspect-still w-full object-cover sm:aspect-photo"
              />
            )}
            <Button
              type="button"
              variant="pill"
              size="sm"
              className="absolute right-4 bottom-4"
              onClick={() => openLightbox(room.image)}
            >
              <Maximize2 className="size-4" />
              Enlarge
            </Button>
          </div>

          <div className="flex flex-col rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <p className="text-xs tracking-[0.18em] text-teak uppercase">{room.kicker}</p>
            <h3 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{room.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted">{room.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {room.finishes.map((finish) => (
                <li
                  key={finish}
                  className="rounded-full bg-salt px-3 py-1.5 text-xs text-ink"
                >
                  {finish}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between pt-8">
              <Button type="button" variant="outline" size="sm" onClick={() => step(-1)}>
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <p className="text-xs tabular-nums text-muted">
                {index + 1} / {rooms.length}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => step(1)}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
