import { createFileRoute } from "@tanstack/react-router";
import { MapStudio } from "@/components/MapStudio";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  return <MapStudio />;
}
