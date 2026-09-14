import { createFileRoute } from "@tanstack/react-router";
import { WalkStudio } from "@/components/WalkStudio";
import { walkSearch } from "@/lib/walk-route";

export const Route = createFileRoute("/moonlightbay3dview")({
  validateSearch: walkSearch,
  head: () => ({
    meta: [
      { title: "Moonlight Bay 3D view" },
      {
        name: "description",
        content: "Walk the Moonlight Bay plat. Enter homes on the canal and the beach.",
      },
    ],
  }),
  component: WalkStudio,
});
