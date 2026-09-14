import { createFileRoute } from "@tanstack/react-router";
import { WalkStudio } from "@/components/WalkStudio";
import { walkSearch } from "@/lib/walk-route";

export const Route = createFileRoute("/3d")({
  validateSearch: walkSearch,
  head: () => ({
    meta: [
      { title: "Moonlight Bay 3D view" },
      {
        name: "description",
        content: "Walk the Moonlight Bay plat. Enter Lot 115 and every other home.",
      },
    ],
  }),
  component: WalkStudio,
});
