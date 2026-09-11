import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { TourReel } from "@/components/TourReel";
import { RoomFilms } from "@/components/RoomFilms";
import { QuoteStudio } from "@/components/QuoteStudio";
import { Palette } from "@/components/Palette";
import { RoomStudio } from "@/components/RoomStudio";
import { FloorPlan } from "@/components/FloorPlan";
import { LotPlan } from "@/components/LotPlan";
import { Neighborhood } from "@/components/Neighborhood";
import { GateVillage } from "@/components/GateVillage";
import { CanalValue } from "@/components/CanalValue";
import { FactoryFit } from "@/components/FactoryFit";
import { Materials } from "@/components/Materials";
import { Gallery } from "@/components/Gallery";
import { Lightbox } from "@/components/Lightbox";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <TourReel />
        <RoomFilms />
        <QuoteStudio />
        <Palette />
        <RoomStudio />
        <FloorPlan />
        <LotPlan />
        <Neighborhood />
        <GateVillage />
        <CanalValue />
        <FactoryFit />
        <Materials />
        <Gallery />
      </main>
      <footer className="border-t border-line px-4 py-10 text-center sm:px-6">
        <p className="font-display text-2xl text-ink">Moonlight Bay</p>
        <p className="mt-2 text-sm text-muted">
          Beach and canal villas, mixed lot catalog, gate-row cottages, and room films of the house.{" "}
          <a href="#films" className="underline underline-offset-2">
            Watch the rooms
          </a>
          {" · "}
          <a href="/map" className="underline underline-offset-2">
            Built-out site map
          </a>
          .
        </p>
        <p className="mt-3 text-xs text-muted">
          Factory quotation, FF&E, and MEP documents are issued privately — not part of this studio.{" "}
          <a href="/site-map.html" className="underline underline-offset-2" target="_blank" rel="noreferrer">
            Community site map (July 2026 snapshot)
          </a>
          — confirm current lots with the developer.
        </p>
      </footer>
      <Lightbox />
    </div>
  );
}
