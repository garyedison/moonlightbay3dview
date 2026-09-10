import { WalkStudio } from "@/components/WalkStudio";

export function walkSearch(search: Record<string, unknown>): { lot?: number } {
  const n = Number(search.lot);
  if (Number.isFinite(n) && n > 0) return { lot: n };
  return {};
}

export const walkHead = () => ({
  meta: [
    { title: "Moonlight Bay 3D View" },
    {
      name: "description",
      content:
        "Walk the Moonlight Bay de Consejo plat in 3D — every lot, mixed models, dollhouse and inside rooms.",
    },
  ],
});

export function WalkPage() {
  return <WalkStudio />;
}

/** Public path for the 3D community walk. */
export const VIEW_3D_PATH = "/3d";
