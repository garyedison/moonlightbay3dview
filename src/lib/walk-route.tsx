import { SiteHeader } from "@/components/SiteHeader";
import { RoomFilms } from "@/components/RoomFilms";
import { TourReel } from "@/components/TourReel";

export function walkSearch(search: Record<string, unknown>): { lot?: number } {
  const n = Number(search.lot);
  if (Number.isFinite(n) && n > 0) return { lot: n };
  return {};
}

export const walkHead = () => ({
  meta: [
    { title: "Moonlight Bay room films" },
    {
      name: "description",
      content:
        "Video walkthrough of each Moonlight Bay room — kitchen, living, dining, bedrooms, and bath.",
    },
  ],
});

export function WalkPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main>
        <TourReel />
        <RoomFilms />
      </main>
    </div>
  );
}

export const VIEW_3D_PATH = "/3d";
