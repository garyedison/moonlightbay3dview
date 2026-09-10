import * as THREE from "three";
import { lotArchetype, lotPlan, type Lot, type PlanRoom, type RoomKind } from "./community";
import { photoForRoom } from "./tours";

const SALT = 0xf3eee4;
const SAND = 0xd6c4a5;
const LAGOON = 0x2c5854;
const TEAK = 0x7a5a38;
const LINEN = 0xe7e0d4;
const GLASS = 0xcfe4e2;
const STONE = 0xb7b2a6;

const KIND_FLOOR: Record<RoomKind, number> = {
  live: 0xe4d8c4,
  kitchen: 0xd9cbb3,
  bed: 0xeee6d8,
  bath: 0xd8ddd8,
  studio: 0xe4d8c4,
};

const loader = new THREE.TextureLoader();
const texCache = new Map<string, THREE.Texture>();

export function loadTex(url: string): THREE.Texture {
  const hit = texCache.get(url);
  if (hit) return hit;
  const t = loader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearFilter;
  t.anisotropy = 4;
  texCache.set(url, t);
  return t;
}

export type InteriorBuilt = {
  group: THREE.Group;
  hotspots: THREE.Mesh[];
  rooms: PlanRoom[];
};

export function worldFromLocal(lot: Lot, lx: number, lz: number) {
  const c = Math.cos(lot.rot);
  const s = Math.sin(lot.rot);
  return {
    x: lot.x + lx * c + lz * s,
    z: lot.z - lx * s + lz * c,
  };
}

export function buildInterior(lot: Lot, floor: 1 | 2): InteriorBuilt {
  const arch = lotArchetype(lot);
  const rooms = lotPlan(lot).filter((r) => r.floor === floor).map((r) => ({ ...r }));
  if (floor === 1 && (lot.zone === "canal" || lot.zone === "beach" || lot.zone === "gate")) {
    rooms.push({
      id: "deck",
      name: lot.zone === "beach" ? "Beach terrace" : "Canal deck",
      x: 0,
      z: arch.d * 0.58 + 1.35,
      w: arch.w * 0.95,
      d: 1.7,
      floor: 1,
      kind: "live",
    });
  }
  if (floor === 2 && arch.stories === 2) {
    rooms.push({
      id: "balcony",
      name: "Balcony",
      x: 0,
      z: arch.d * 0.42,
      w: arch.w * 0.8,
      d: 1.2,
      floor: 2,
      kind: "live",
    });
  }

  const g = new THREE.Group();
  g.position.set(lot.x, floor === 2 ? arch.h * 0.48 : 0, lot.z);
  g.rotation.y = lot.rot;

  const shellW = arch.w * 1.5;
  const shellD = arch.d * 1.22;

  const floorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(shellW, 0.08, shellD),
    new THREE.MeshLambertMaterial({ color: TEAK }),
  );
  floorMesh.position.y = 0.04;
  g.add(floorMesh);

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(shellW, 2.72, shellD),
    new THREE.MeshLambertMaterial({ color: SALT, side: THREE.BackSide }),
  );
  walls.position.y = 1.4;
  g.add(walls);

  const ceil = new THREE.Mesh(
    new THREE.BoxGeometry(shellW, 0.06, shellD),
    new THREE.MeshLambertMaterial({ color: 0xf7f3ea, side: THREE.DoubleSide }),
  );
  ceil.position.y = 2.72;
  g.add(ceil);

  const window = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.min(2.8, arch.w * 0.85), 1.35),
    new THREE.MeshBasicMaterial({ color: GLASS, transparent: true, opacity: 0.55 }),
  );
  window.position.set(0, 1.55, shellD * 0.5 - 0.04);
  g.add(window);

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(shellW * 0.96, 2.5, 0.06),
    new THREE.MeshLambertMaterial({ color: arch.kind === "steel" ? LAGOON : TEAK }),
  );
  accent.position.set(0, 1.35, -shellD * 0.5 + 0.04);
  g.add(accent);

  const hotspots: THREE.Mesh[] = [];

  for (const room of rooms) {
    const isDeck = room.id === "deck";
    if (!isDeck) {
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(room.w, 0.04, room.d),
        new THREE.MeshLambertMaterial({ color: KIND_FLOOR[room.kind] }),
      );
      plate.position.set(room.x, 0.1, room.z);
      g.add(plate);
      addFurniture(g, room);
      addPartitions(g, room, shellW, shellD);
      addPhotoWall(g, room, photoForRoom(room.id, arch.id, lot.zone));
    }

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0xf2d089 }),
    );
    dot.position.set(room.x, isDeck ? 0.55 : 0.95, room.z);
    dot.userData.roomId = room.id;
    g.add(dot);
    hotspots.push(dot);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8),
      new THREE.MeshBasicMaterial({ color: 0xf2d089 }),
    );
    stem.position.set(room.x, isDeck ? 0.28 : 0.45, room.z);
    g.add(stem);
  }

  const lamp = new THREE.PointLight(0xfff3d8, 18, 14);
  lamp.position.set(0, 2.35, 0);
  g.add(lamp);
  const fill = new THREE.PointLight(0xe8f0f2, 8, 14);
  fill.position.set(0.8, 2.1, 1.4);
  g.add(fill);

  return { group: g, hotspots, rooms };
}

function addPhotoWall(g: THREE.Group, room: PlanRoom, url: string) {
  const w = Math.max(1.8, Math.min(room.w * 0.92, 4.6));
  const h = 2.15;
  const mat = new THREE.MeshBasicMaterial({ map: loadTex(url) });
  mat.userData.keep = true;
  mat.toneMapped = false;
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  photo.position.set(room.x, 1.28, room.z + room.d * 0.48);
  photo.rotation.y = Math.PI;
  g.add(photo);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.04),
    new THREE.MeshLambertMaterial({ color: TEAK }),
  );
  frame.position.set(room.x, 1.28, room.z + room.d * 0.49);
  g.add(frame);
}

function box(w: number, h: number, d: number, color: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
  m.position.set(x, y, z);
  return m;
}

function addFurniture(g: THREE.Group, room: PlanRoom) {
  const { x, z, w, d, kind } = room;
  if (kind === "live" || kind === "studio") {
    g.add(box(Math.min(1.9, w * 0.7), 0.52, 0.62, SAND, x, 0.42, z + d * 0.08));
    g.add(box(0.85, 0.32, 0.85, TEAK, x, 0.32, z - d * 0.12));
    g.add(box(Math.min(1.6, w * 0.55), 0.04, Math.min(1.2, d * 0.3), 0xc45c3e, x, 0.14, z - d * 0.05));
  }
  if (kind === "kitchen") {
    g.add(box(w * 0.86, 0.9, 0.5, 0x3d4f4c, x, 0.55, z + d * 0.18));
    g.add(box(w * 0.5, 0.08, 0.48, STONE, x, 1.02, z + d * 0.18));
    g.add(box(0.7, 0.75, 0.7, TEAK, x - w * 0.15, 0.5, z - d * 0.18));
  }
  if (kind === "bed") {
    g.add(box(Math.min(1.5, w * 0.7), 0.42, Math.min(2.0, d * 0.55), LINEN, x, 0.38, z - d * 0.08));
    g.add(box(0.35, 0.4, 0.35, TEAK, x + w * 0.32, 0.32, z + d * 0.12));
    g.add(box(Math.min(1.5, w * 0.7), 0.12, 0.18, LAGOON, x, 0.62, z - d * 0.22));
  }
  if (kind === "bath") {
    g.add(box(Math.min(1.1, w * 0.45), 1.4, Math.min(1.1, d * 0.55), 0xd9e2e0, x + w * 0.22, 0.8, z));
    g.add(box(0.7, 0.7, 0.4, STONE, x - w * 0.22, 0.48, z + d * 0.05));
  }
  if (kind === "studio") {
    g.add(box(0.9, 0.85, 0.45, 0x3d4f4c, x + w * 0.28, 0.55, z - d * 0.22));
  }
}

function addPartitions(g: THREE.Group, room: PlanRoom, shellW: number, shellD: number) {
  if (room.kind === "bath") {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(Math.min(room.w, shellW * 0.7), 2.4, 0.08),
      new THREE.MeshLambertMaterial({ color: SALT }),
    );
    wall.position.set(room.x, 1.2, room.z + room.d * 0.52);
    g.add(wall);
  }
  void shellD;
}
