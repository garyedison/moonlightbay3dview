import { create } from "zustand";
import { type ModelId, type SiteId, roomsFor } from "./villa";
import { type LaneId } from "./cottages";
import { type BandId, bandById } from "./neighborhood";

type StudioState = {
  model: ModelId;
  site: SiteId;
  lane: LaneId;
  roomId: string;
  gateLot: number;
  valueLot: number;
  neighBand: BandId;
  neighLot: number;
  lightbox: string | null;
  setModel: (model: ModelId) => void;
  setSite: (site: SiteId) => void;
  setLane: (lane: LaneId) => void;
  setRoom: (id: string) => void;
  setGateLot: (lot: number) => void;
  setValueLot: (lot: number) => void;
  setNeighBand: (band: BandId) => void;
  setNeighLot: (lot: number) => void;
  openLightbox: (src: string) => void;
  closeLightbox: () => void;
};

export const useStudio = create<StudioState>((set, get) => ({
  model: "v3",
  site: "beach",
  lane: "villas",
  roomId: "living",
  gateLot: 330,
  valueLot: 108,
  neighBand: "beach",
  neighLot: 196,
  lightbox: null,
  setModel: (model) => {
    const available = roomsFor(model);
    const still = available.find((room) => room.id === get().roomId);
    set({ model, roomId: still ? still.id : available[0].id });
  },
  setSite: (site) => set({ site, lane: "villas" }),
  setLane: (lane) => set({ lane }),
  setRoom: (id) => set({ roomId: id }),
  setGateLot: (lot) => set({ gateLot: lot, lane: "gate" }),
  setValueLot: (lot) => set({ valueLot: lot, lane: "value" }),
  setNeighBand: (neighBand) => {
    const first = bandById(neighBand).houses[0].lot;
    set({ neighBand, neighLot: first, lane: "villas" });
  },
  setNeighLot: (neighLot) => set({ neighLot }),
  openLightbox: (src) => set({ lightbox: src }),
  closeLightbox: () => set({ lightbox: null }),
}));
