export type RoomFilm = {
  id: string;
  name: string;
  src: string;
  poster: string;
  caption: string;
};

export const ROOM_FILMS: RoomFilm[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    src: "/tour/rooms/kitchen.mp4",
    poster: "/villa/kitchen.jpg",
    caption: "Teak, limestone, sea-glass tile. Same wet pack in every house.",
  },
  {
    id: "living",
    name: "Living",
    src: "/tour/rooms/living.mp4",
    poster: "/villa/living.jpg",
    caption: "Sand linen sofa facing the glass. Canal or bay — same room.",
  },
  {
    id: "dining",
    name: "Dining",
    src: "/tour/rooms/dining.mp4",
    poster: "/villa/dining.jpg",
    caption: "Teak table and rattan. The long view through the house.",
  },
  {
    id: "bed1",
    name: "Primary",
    src: "/tour/rooms/bed1.mp4",
    poster: "/villa/bedroom-canal.jpg",
    caption: "Ivory linen, rattan headboard, the whole bed in frame.",
  },
  {
    id: "bed2",
    name: "Guest",
    src: "/tour/rooms/bed2.mp4",
    poster: "/villa/bedroom-guest.jpg",
    caption: "Same furniture family as the primary. Quiet end of the house.",
  },
  {
    id: "bath",
    name: "Bath",
    src: "/tour/rooms/bath.mp4",
    poster: "/villa/bath.jpg",
    caption: "Honed limestone and teak. Factory-fitted wet room.",
  },
];

const BY_ROOM: Record<string, string> = {
  kitchen: "/tour/rooms/kitchen.mp4",
  living: "/tour/rooms/living.mp4",
  dining: "/tour/rooms/dining.mp4",
  guest: "/tour/rooms/bed2.mp4",
  bath: "/tour/rooms/bath.mp4",
  "bed-canal": "/tour/rooms/bed1.mp4",
  "bed-beach": "/tour/rooms/bed1.mp4",
};

export function filmFor(roomId: string): string | undefined {
  return BY_ROOM[roomId];
}

export const INTERIORS_REEL = "/tour/interiors.mp4";
export const COMMUNITY_REEL = "/tour/community.mp4";
