import * as THREE from "three";
import type { PanoKey } from "./panos";

/**
 * Six separate wall photos on an inverted cube — no equirect stitch.
 * Looking forward: complete subject. Turn 90°: a different complete wall
 * (nightstand, window, closet) so the bed is never cut in half.
 *
 * BoxGeometry groups: +X -X +Y -Y +Z -Z
 * Camera yaw=0 looks −Z, so pz is the last material.
 */
const FACE_FILES = ["px", "nx", "py", "ny", "nz", "pz"] as const;

const cache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

let mesh: THREE.Mesh | null = null;

function faceTex(url: string, flipX: boolean): THREE.Texture {
  const key = url + (flipX ? ":fx" : "");
  const hit = cache.get(key);
  if (hit) return hit;
  const t = loader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.center.set(0.5, 0.5);
  if (flipX) {
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
  }
  t.minFilter = THREE.LinearFilter;
  cache.set(key, t);
  return t;
}

function mats(key: PanoKey): THREE.MeshBasicMaterial[] {
  return FACE_FILES.map((f, i) => {
    const isWall = f === "px" || f === "nx" || f === "pz" || f === "nz";
    const t = faceTex(`/pano/${key}/${f}.jpg?v=walls1`, isWall);
    if (f === "py") t.rotation = Math.PI;
    if (f === "ny") t.rotation = Math.PI;
    return new THREE.MeshBasicMaterial({
      map: t,
      side: THREE.BackSide,
      toneMapped: false,
      depthWrite: false,
    });
  });
}

function ensure(scene: THREE.Scene) {
  if (mesh) return mesh;
  const geo = new THREE.BoxGeometry(50, 50, 50);
  mesh = new THREE.Mesh(geo, mats("kitchen"));
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
}

export function showPano(scene: THREE.Scene, key: PanoKey) {
  const m = ensure(scene);
  const old = m.material;
  m.material = mats(key);
  if (Array.isArray(old)) old.forEach((mat) => mat.dispose());
  m.visible = true;
  scene.background = new THREE.Color(0x111111);
  if (scene.fog) scene.fog = null;
}

export function hidePano(scene: THREE.Scene, color = 0xb9cfd4) {
  if (mesh) mesh.visible = false;
  scene.background = new THREE.Color(color);
  scene.fog = new THREE.Fog(color, 80, 220);
}

export function syncPano(x: number, y: number, z: number) {
  if (mesh) mesh.position.set(x, y, z);
}
