import { createFileRoute } from "@tanstack/react-router";
import { WalkPage, walkHead, walkSearch } from "@/lib/walk-route";

export const Route = createFileRoute("/walk")({
  validateSearch: walkSearch,
  head: walkHead,
  component: WalkPage,
});
