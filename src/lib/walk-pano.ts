import * as THREE from "three";
import type { PanoKey } from "./panos";

/**
 * One equirectangular per room, inverted sphere at the camera.
 * Stitched from 6 views shot at the SAME standing point so the horizon
 * stays level when you look left/right — no cubemap face rotations.
 */
const cache = new Map<PanoKey, THREE.Texture>();
const loader = new THREE.TextureLoader();

let mesh: THREE.Mesh | null = null;

function tex(key: PanoKey): THREE.Texture {
  const hit = cache.get(key);
  if (hit) return hit;
  const t = loader.load(`/pano/eq/${key}.jpg?v=eq1`);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearFilter;
  cache.set(key, t);
  return t;
}

function ensure(scene: THREE.Scene) {
  if (mesh) return mesh;
  const geo = new THREE.SphereGeometry(40, 64, 40);
  geo.scale(-1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false, depthWrite: false });
  mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
}

export function showPano(scene: THREE.Scene, key: PanoKey) {
  const m = ensure(scene);
  const mat = m.material as THREE.MeshBasicMaterial;
  mat.map = tex(key);
  mat.needsUpdate = true;
  m.visible = true;
  scene.background = new THREE.Color(0x1a2220);
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
