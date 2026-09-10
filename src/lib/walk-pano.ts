import * as THREE from "three";
import type { PanoKey } from "./panos";

/**
 * CubeTextureLoader order is +X -X +Y -Y +Z -Z.
 * Three.js samples CubeTextures with flipEnvMap = -1 on X, so looking right
 * reads the -X slot. We put the RIGHT-wall photo (px) in that slot, and the
 * hero wall (pz) in -Z so yaw=0 looks at the room's front with floor down.
 */
const FACE_ORDER = ["nx", "px", "py", "ny", "nz", "pz"] as const;

const cache = new Map<PanoKey, THREE.CubeTexture>();
const loader = new THREE.CubeTextureLoader();

export function loadPano(key: PanoKey): THREE.CubeTexture {
  const hit = cache.get(key);
  if (hit) return hit;
  const urls = FACE_ORDER.map((f) => `/pano/${key}/${f}.jpg?v=axis2`);
  const tex = loader.load(urls);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

export function showPano(scene: THREE.Scene, key: PanoKey) {
  scene.background = loadPano(key);
  if (scene.fog) scene.fog = null;
}

export function hidePano(scene: THREE.Scene, color = 0xb9cfd4) {
  scene.background = new THREE.Color(color);
  scene.fog = new THREE.Fog(color, 80, 220);
}
