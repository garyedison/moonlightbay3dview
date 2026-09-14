import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SpiralCompare } from "@/components/SpiralCompare";
import { Lightbox } from "@/components/Lightbox";

export const Route = createFileRoute("/lot-115")({
  component: Lot115Page,
  head: () => ({
    meta: [
      { title: "Lot 115 · Spiral-deck container · Moonlight Bay" },
      {
        name: "description",
        content:
          "Customer look on Lot 115: cedar spiral-deck container, 2 bed / 2 bath, 400 sf teak deck. Side-by-side with the hip-roof bungalow previously quoted.",
      },
    ],
  }),
});

function Lot115Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main>
        <SpiralCompare />
      </main>
      <footer className="border-t border-line px-4 py-10 text-center sm:px-6">
        <p className="font-display text-2xl text-ink">Moonlight Bay</p>
        <p className="mt-2 text-sm text-muted">
          Lot 115 canal bank · spiral-deck container beside the previous hip-roof quote.{" "}
          <a href="/3d?lot=115" className="underline underline-offset-2">
            Open the 3D walk
          </a>
          .
        </p>
      </footer>
      <Lightbox />
    </div>
  );
}
