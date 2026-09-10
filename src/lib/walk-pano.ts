import * as THREE from "three";
import type { PanoKey } from "./panos";

/**
 * CubeTexture as scene.background — camera looks around a true skybox.
 * Neighboring 3D houses must NOT be in the scene while a pano is showing
 * (they sat inside the old 24m box and leaked into the kitchen).
 *
 * File order maps camera-forward (−Z) to pz.jpg (the room's hero wall).
 */
const FACE_ORDER = ["px", "nx", "py", "ny", "nz", "pz"] as const;

const cache = new Map<PanoKey, THREE.CubeTexture>();
const loader = new THREE.CubeTextureLoader();

export function loadPano(key: PanoKey): THREE.CubeTexture {
  const hit = cache.get(key);
  if (hit) return hit;
  const urls = FACE_ORDER.map((f) => `/pano/${key}/${f}.jpg`);
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
