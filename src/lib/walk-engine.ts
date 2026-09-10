import * as THREE from "three";
import { LOTS, WORLD, lotArchetype, type Kind, type Lot, type PlanRoom } from "./community";
import { buildInterior, worldFromLocal, type InteriorBuilt } from "./walk-interior";

export type WalkMode = "dollhouse" | "ground" | "inside";

export type WalkApi = {
  dispose: () => void;
  setMode: (mode: WalkMode) => void;
  enterLot: (n: number) => void;
  exitHouse: () => void;
  focusLot: (n: number) => void;
  selectLot: (n: number | null) => void;
  goRoom: (id: string) => void;
  setFloor: (floor: 1 | 2) => void;
  setFilter: (kind: "all" | Kind) => void;
  setKeys: (codes: string[]) => void;
  setPose: (x: number, z: number, yaw?: number) => void;
  setMove: (x: number, z: number) => void;
  getYaw: () => number;
  getSpeed: () => number;
  getSelected: () => number | null;
  getMode: () => WalkMode;
  getFloor: () => 1 | 2;
  getRooms: () => PlanRoom[];
  getInsideLot: () => number | null;
  onChange: (fn: () => void) => void;
};

const TEAK = 0x7a5a38;

type HouseParts = {
  body: THREE.InstancedMesh;
  roof: THREE.InstancedMesh;
  upper: THREE.InstancedMesh;
  deck: THREE.InstancedMesh;
  glass: THREE.InstancedMesh;
};

export function mountWalk(canvas: HTMLCanvasElement): WalkApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xb9cfd4, 1);
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xb9cfd4, 80, 220);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);
  const clock = new THREE.Clock();

  scene.add(new THREE.HemisphereLight(0xe8f0f2, 0x7a6a50, 1.05));
  const sun = new THREE.DirectionalLight(0xfff1d6, 1.15);
  sun.position.set(40, 70, 20);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.width + 40, WORLD.depth + 40),
    new THREE.MeshLambertMaterial({ color: 0xcbb89a }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(WORLD.width / 2, 0, WORLD.depth / 2);
  scene.add(ground);

  const bay = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.width + 60, 28),
    new THREE.MeshLambertMaterial({ color: 0x5e9aa8 }),
  );
  bay.rotation.x = -Math.PI / 2;
  bay.position.set(WORLD.width / 2, 0.04, -6);
  scene.add(bay);

  addCanal(scene);
  addParks(scene);
  addRoads(scene);

  const houses = buildHouses(scene);
  addPalms(scene);

  const selectRing = new THREE.Mesh(
    new THREE.RingGeometry(2.8, 3.3, 24),
    new THREE.MeshBasicMaterial({ color: 0xe8a13a, side: THREE.DoubleSide }),
  );
  selectRing.rotation.x = -Math.PI / 2;
  selectRing.position.y = 0.08;
  selectRing.visible = false;
  scene.add(selectRing);

  let interior: InteriorBuilt | null = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const keys = new Set<string>();
  let analogX = 0;
  let analogZ = 0;
  let mode: WalkMode = "dollhouse";
  let selected: number | null = 196;
  let insideLot: number | null = null;
  let floor: 1 | 2 = 1;
  let filter: "all" | Kind = "all";
  let yaw = 0.4;
  let pitch = -0.72;
  let speed = 0;
  let orbitDist = 95;
  let dragging = false;
  let dragMoved = false;
  let lastX = 0;
  let lastY = 0;
  let listeners: Array<() => void> = [];
  let raf = 0;
  let running = true;
  const pos = new THREE.Vector3(WORLD.width * 0.35, 1.7, WORLD.depth * 0.45);
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const look = new THREE.Vector3();
  const orbitTarget = new THREE.Vector3(WORLD.width * 0.52, 0, WORLD.depth * 0.48);
  const walkTarget = new THREE.Vector3();
  let walkingTo = false;
  let tweenT = 1;
  const tweenFrom = new THREE.Vector3();
  const tweenTo = new THREE.Vector3();
  let tweenYawFrom = 0;
  let tweenYawTo = 0;

  function notify() {
    for (const fn of listeners) fn();
  }

  function resize() {
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 500;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();

  const lotDummy = new THREE.Object3D();
  function offsetXZ(lot: Lot, alongD: number) {
    return {
      x: lot.x + Math.sin(lot.rot) * alongD,
      z: lot.z + Math.cos(lot.rot) * alongD,
    };
  }

  function writeLot(lot: Lot, i: number, hidden: boolean) {
    const arch = lotArchetype(lot);
    const vis = hidden ? 0.001 : 1;
    lotDummy.position.set(lot.x, hidden ? -20 : arch.h / 2, lot.z);
    lotDummy.rotation.set(0, lot.rot, 0);
    lotDummy.scale.set(arch.w * vis, arch.h * vis, arch.d * vis);
    lotDummy.updateMatrix();
    houses.body.setMatrixAt(i, lotDummy.matrix);

    lotDummy.position.set(lot.x, hidden || arch.kind !== "wood" ? -20 : arch.h + 0.55, lot.z);
    lotDummy.rotation.set(0, lot.rot + Math.PI / 4, 0);
    lotDummy.scale.set(arch.w * 1.15 * vis, 1.1 * vis, arch.d * 0.55 * vis);
    lotDummy.updateMatrix();
    houses.roof.setMatrixAt(i, lotDummy.matrix);

    lotDummy.position.set(lot.x, hidden || arch.stories !== 2 ? -20 : arch.h * 0.72, lot.z);
    lotDummy.rotation.set(0, lot.rot, 0);
    lotDummy.scale.set(arch.w * 0.92 * vis, (arch.stories === 2 ? arch.h * 0.45 : 0.01) * vis, arch.d * 0.7 * vis);
    lotDummy.updateMatrix();
    houses.upper.setMatrixAt(i, lotDummy.matrix);

    const deck = offsetXZ(lot, arch.d * 0.55 + 0.9);
    lotDummy.position.set(deck.x, hidden ? -20 : 0.12, deck.z);
    lotDummy.rotation.set(0, lot.rot, 0);
    lotDummy.scale.set(arch.w * 0.95 * vis, 0.16 * vis, 1.8 * vis);
    lotDummy.updateMatrix();
    houses.deck.setMatrixAt(i, lotDummy.matrix);

    const glass = offsetXZ(lot, arch.d * 0.51);
    lotDummy.position.set(glass.x, hidden ? -20 : arch.h * 0.52, glass.z);
    lotDummy.rotation.set(0, lot.rot, 0);
    lotDummy.scale.set(arch.w * 0.46 * vis, arch.h * 0.28 * vis, 0.08 * vis);
    lotDummy.updateMatrix();
    houses.glass.setMatrixAt(i, lotDummy.matrix);
  }

  function applyFilter() {
    LOTS.forEach((lot, i) => {
      const arch = lotArchetype(lot);
      const show = filter === "all" || arch.kind === filter;
      writeLot(lot, i, !show || insideLot === lot.n);
    });
    houses.body.instanceMatrix.needsUpdate = true;
    houses.roof.instanceMatrix.needsUpdate = true;
    houses.upper.instanceMatrix.needsUpdate = true;
    houses.deck.instanceMatrix.needsUpdate = true;
    houses.glass.instanceMatrix.needsUpdate = true;
  }
  applyFilter();

  function selectLot(n: number | null) {
    selected = n;
    if (n == null) {
      selectRing.visible = false;
    } else {
      const lot = LOTS.find((l) => l.n === n);
      if (lot) {
        selectRing.visible = true;
        selectRing.position.set(lot.x, 0.08, lot.z);
      }
    }
    notify();
  }
  selectLot(196);

  function clearInterior() {
    if (interior) {
      scene.remove(interior.group);
      interior.group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      interior = null;
    }
  }

  function startTween(to: THREE.Vector3, nextYaw: number) {
    tweenFrom.copy(pos);
    tweenTo.copy(to);
    tweenYawFrom = yaw;
    tweenYawTo = nextYaw;
    tweenT = 0;
  }

  function mountInterior(lot: Lot) {
    clearInterior();
    interior = buildInterior(lot, floor);
    scene.add(interior.group);
  }

  function enterLot(n: number) {
    const lot = LOTS.find((l) => l.n === n);
    if (!lot) return;
    selected = n;
    insideLot = n;
    floor = 1;
    mode = "inside";
    mountInterior(lot);
    const rooms = interior?.rooms ?? [];
    const start = rooms[0];
    const local = start ? worldFromLocal(lot, start.x, start.z) : { x: lot.x, z: lot.z };
    pos.set(local.x, 1.55, local.z);
    yaw = Math.atan2(-(lot.x - local.x), -(lot.z - local.z));
    pitch = 0;
    walkingTo = false;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = 18;
      scene.fog.far = 70;
    }
    applyFilter();
    selectLot(n);
    notify();
  }

  function goRoom(id: string) {
    if (!insideLot || !interior) return;
    const lot = LOTS.find((l) => l.n === insideLot);
    const room = interior.rooms.find((r) => r.id === id);
    if (!lot || !room) return;
    const w = worldFromLocal(lot, room.x, room.z);
    startTween(new THREE.Vector3(w.x, 1.55, w.z), Math.atan2(-(lot.x - w.x), -(lot.z - w.z)));
    notify();
  }

  function setFloor(next: 1 | 2) {
    if (!insideLot) return;
    const lot = LOTS.find((l) => l.n === insideLot);
    if (!lot) return;
    const arch = lotArchetype(lot);
    if (arch.stories === 1) return;
    floor = next;
    mountInterior(lot);
    const rooms = interior?.rooms ?? [];
    const start = rooms[0];
    if (start) {
      const w = worldFromLocal(lot, start.x, start.z);
      pos.set(w.x, 1.55, w.z);
    }
    notify();
  }

  function exitHouse() {
    const lot = insideLot != null ? LOTS.find((l) => l.n === insideLot) : null;
    insideLot = null;
    floor = 1;
    clearInterior();
    mode = "ground";
    if (lot) {
      const front = offsetXZ(lot, lotArchetype(lot).d * 0.7 + 2.4);
      pos.set(front.x, 1.65, front.z);
      yaw = lot.rot + Math.PI;
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = 80;
      scene.fog.far = 220;
    }
    applyFilter();
    notify();
  }

  function focusLot(n: number) {
    const lot = LOTS.find((l) => l.n === n);
    if (!lot) return;
    selectLot(n);
    orbitTarget.set(lot.x, 0, lot.z);
    if (mode === "dollhouse") {
      orbitDist = 28;
      pitch = -0.85;
    } else if (mode === "ground") {
      const front = offsetXZ(lot, lotArchetype(lot).d * 0.7 + 2.4);
      startTween(new THREE.Vector3(front.x, 1.65, front.z), lot.rot + Math.PI);
    } else {
      enterLot(n);
    }
    notify();
  }

  function hitHotspot(clientX: number, clientY: number): string | null {
    if (!interior || mode !== "inside") return null;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interior.hotspots, false);
    if (!hits.length) return null;
    return (hits[0].object.userData.roomId as string) ?? null;
  }

  function hitLot(clientX: number, clientY: number): number | null {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(houses.body);
    if (!hits.length) return null;
    const id = hits[0].instanceId;
    if (id == null) return null;
    return LOTS[id]?.n ?? null;
  }

  function hitGround(clientX: number, clientY: number): THREE.Vector3 | null {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(ground);
    if (!hits.length) return null;
    return hits[0].point;
  }

  function onPointerDown(ev: PointerEvent) {
    dragging = true;
    dragMoved = false;
    lastX = ev.clientX;
    lastY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  }
  function onPointerMove(ev: PointerEvent) {
    if (!dragging) return;
    const dx = ev.clientX - lastX;
    const dy = ev.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
    if (mode === "dollhouse") {
      yaw -= dx * 0.005;
      pitch = THREE.MathUtils.clamp(pitch - dy * 0.004, -1.2, -0.25);
    } else {
      yaw -= dx * 0.005;
      pitch = THREE.MathUtils.clamp(pitch - dy * 0.004, -1.2, 1.2);
    }
  }
  function onPointerUp(ev: PointerEvent) {
    dragging = false;
    if (dragMoved) return;
    const roomId = hitHotspot(ev.clientX, ev.clientY);
    if (roomId) {
      goRoom(roomId);
      return;
    }
    const n = hitLot(ev.clientX, ev.clientY);
    if (n != null) {
      if (mode === "inside" && n === insideLot) return;
      selectLot(n);
      if (mode === "dollhouse") {
        const lot = LOTS.find((l) => l.n === n);
        if (lot) orbitTarget.set(lot.x, 0, lot.z);
      }
      return;
    }
    if (mode === "ground") {
      const pt = hitGround(ev.clientX, ev.clientY);
      if (pt) {
        walkTarget.set(pt.x, 1.65, pt.z);
        walkingTo = true;
      }
    }
  }
  function onWheel(ev: WheelEvent) {
    if (mode !== "dollhouse") return;
    orbitDist = THREE.MathUtils.clamp(orbitDist + ev.deltaY * 0.04, 18, 160);
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("resize", resize);

  const onKeyDown = (e: KeyboardEvent) => {
    keys.add(e.code);
    if (e.code === "Escape" && mode === "inside") exitHouse();
    if (e.code === "KeyE" && selected != null && mode !== "inside") enterLot(selected);
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
  const onBlur = () => keys.clear();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onBlur);

  function blocked(nx: number, nz: number) {
    if (mode === "inside" && insideLot != null) {
      const lot = LOTS.find((l) => l.n === insideLot);
      if (!lot) return false;
      const arch = lotArchetype(lot);
      const c = Math.cos(-lot.rot);
      const s = Math.sin(-lot.rot);
      const dx = nx - lot.x;
      const dz = nz - lot.z;
      const lx = dx * c + dz * s;
      const lz = -dx * s + dz * c;
      return Math.abs(lx) > arch.w * 0.62 || Math.abs(lz) > arch.d * 0.55;
    }
    for (const lot of LOTS) {
      if (insideLot === lot.n) continue;
      const arch = lotArchetype(lot);
      if (Math.abs(nx - lot.x) < arch.w * 0.55 && Math.abs(nz - lot.z) < arch.d * 0.45) return true;
    }
    if (nz < 2) return true;
    if (nx < 4 || nx > WORLD.width - 4 || nz > WORLD.depth - 4) return true;
    return false;
  }

  function tick() {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.1);

    if (interior) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.12;
      for (const h of interior.hotspots) h.scale.setScalar(pulse);
    }

    if (tweenT < 1) {
      tweenT = Math.min(1, tweenT + dt / 0.55);
      const k = 1 - (1 - tweenT) * (1 - tweenT);
      pos.lerpVectors(tweenFrom, tweenTo, k);
      yaw = tweenYawFrom + (tweenYawTo - tweenYawFrom) * k;
    }

    fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));

    const wantsWalk =
      keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD") ||
      keys.has("ArrowUp") || keys.has("ArrowLeft") || keys.has("ArrowDown") || keys.has("ArrowRight") ||
      Math.abs(analogX) + Math.abs(analogZ) > 0.04;
    if (mode === "dollhouse" && wantsWalk) {
      mode = "ground";
      pos.set(orbitTarget.x, 1.65, orbitTarget.z + 6);
      pitch = 0;
      notify();
    }

    if (mode === "dollhouse") {
      camera.position.set(
        orbitTarget.x + Math.sin(yaw) * orbitDist,
        18 + Math.cos(pitch) * (orbitDist * 0.55),
        orbitTarget.z + Math.cos(yaw) * orbitDist,
      );
      camera.lookAt(orbitTarget.x, 0.4, orbitTarget.z);
      speed = 0;
    } else {
      let mx = analogX;
      let mz = analogZ;
      if (keys.has("KeyW") || keys.has("ArrowUp")) mz += 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) mz -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
      const moving = Math.abs(mx) + Math.abs(mz) > 0.04;
      const step = (mode === "inside" ? 4.2 : 7.4) * dt;
      if (moving) {
        walkingTo = false;
        const len = Math.hypot(mx, mz) || 1;
        mx /= len;
        mz /= len;
        const nx = pos.x + fwd.x * mz * step + right.x * mx * step;
        const nz = pos.z + fwd.z * mz * step + right.z * mx * step;
        if (!blocked(nx, pos.z)) pos.x = nx;
        if (!blocked(pos.x, nz)) pos.z = nz;
        speed = mode === "inside" ? 4.2 : 7.4;
      } else if (walkingTo) {
        const dx = walkTarget.x - pos.x;
        const dz = walkTarget.z - pos.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.3) walkingTo = false;
        else {
          const nx = pos.x + (dx / dist) * step;
          const nz = pos.z + (dz / dist) * step;
          if (!blocked(nx, pos.z)) pos.x = nx;
          if (!blocked(pos.x, nz)) pos.z = nz;
          speed = 7.4;
        }
      } else speed = 0;
      pos.y = 1.65;
      camera.position.copy(pos);
      look.copy(pos).addScaledVector(fwd, 6);
      look.y += Math.sin(pitch) * 6;
      camera.lookAt(look);
    }

    renderer.render(scene, camera);
  }
  tick();

  const api: WalkApi = {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onBlur);
      clearInterior();
      renderer.dispose();
    },
    setMode(next) {
      if (next === "inside") {
        enterLot(selected ?? 196);
        return;
      }
      insideLot = null;
      floor = 1;
      clearInterior();
      applyFilter();
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.near = 80;
        scene.fog.far = 220;
      }
      mode = next;
      if (next === "dollhouse") {
        pitch = -0.72;
        orbitDist = 95;
        orbitTarget.set(WORLD.width * 0.52, 0, WORLD.depth * 0.48);
      }
      notify();
    },
    enterLot,
    exitHouse,
    focusLot,
    selectLot,
    goRoom,
    setFloor,
    setFilter(kind) {
      filter = kind;
      applyFilter();
      notify();
    },
    setKeys(codes) {
      keys.clear();
      for (const c of codes) keys.add(c);
    },
    setPose(x: number, z: number, nextYaw?: number) {
      pos.x = x;
      pos.z = z;
      pos.y = 1.65;
      if (typeof nextYaw === "number") yaw = nextYaw;
      if (mode === "dollhouse") {
        mode = "ground";
        pitch = 0;
        notify();
      }
    },
    setMove(x, z) {
      analogX = x;
      analogZ = z;
    },
    getYaw: () => yaw,
    getSpeed: () => speed,
    getSelected: () => selected,
    getMode: () => mode,
    getFloor: () => floor,
    getRooms: () => interior?.rooms ?? [],
    getInsideLot: () => insideLot,
    onChange(fn) {
      listeners.push(fn);
    },
  };

  if (import.meta.env.DEV || new URLSearchParams(location.search).has("qa")) {
    window.__controlsTest = {
      getYaw: () => yaw,
      getSpeed: () => speed,
      getX: () => pos.x,
      getZ: () => pos.z,
      setKeys: (codes) => api.setKeys(codes),
      setPose: (x, z, y) => api.setPose(x, z, y),
    };
  }

  return api;
}

function addCanal(scene: THREE.Scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x4f8f96 });
  const west = new THREE.Mesh(new THREE.PlaneGeometry(12, 72), mat);
  west.rotation.x = -Math.PI / 2;
  west.position.set(4.8 * 8.2, 0.05, 7 * 11.4);
  scene.add(west);
  const east = new THREE.Mesh(new THREE.PlaneGeometry(12, 72), mat);
  east.rotation.x = -Math.PI / 2;
  east.position.set(9.6 * 8.2, 0.05, 7 * 11.4);
  scene.add(east);
  const south = new THREE.Mesh(new THREE.PlaneGeometry(52, 14), mat);
  south.rotation.x = -Math.PI / 2;
  south.position.set(7.2 * 8.2, 0.05, 9.6 * 11.4);
  scene.add(south);
}

function addParks(scene: THREE.Scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x7a9a6a });
  const spots = [
    [7.2 * 8.2, 12.5 * 11.4, 18, 16],
    [19 * 8.2, 6.5 * 11.4, 18, 16],
    [15 * 8.2, 12.5 * 11.4, 18, 16],
  ];
  for (const [x, z, w, d] of spots) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.03, z);
    scene.add(m);
  }
}

function addRoads(scene: THREE.Scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xb7a585 });
  const west = new THREE.Mesh(new THREE.PlaneGeometry(10, WORLD.depth), mat);
  west.rotation.x = -Math.PI / 2;
  west.position.set(8, 0.02, WORLD.depth / 2);
  scene.add(west);
}

function buildHouses(scene: THREE.Scene): HouseParts {
  const n = LOTS.length;
  const body = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    n,
  );
  const roof = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.75, 1, 4),
    new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }),
    n,
  );
  const upper = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    n,
  );
  const deck = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: TEAK }),
    n,
  );
  const glass = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0x9ec4c0 }),
    n,
  );
  body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  roof.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  upper.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  deck.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  glass.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  LOTS.forEach((lot, i) => {
    const arch = lotArchetype(lot);
    dummy.position.set(lot.x, arch.h / 2, lot.z);
    dummy.rotation.set(0, lot.rot, 0);
    dummy.scale.set(arch.w, arch.h, arch.d);
    dummy.updateMatrix();
    body.setMatrixAt(i, dummy.matrix);
    body.setColorAt(i, color.setHex(lot.color));

    dummy.position.set(lot.x, arch.kind === "wood" ? arch.h + 0.55 : -8, lot.z);
    dummy.rotation.set(0, lot.rot + Math.PI / 4, 0);
    dummy.scale.set(arch.w * 1.15, 1.1, arch.d * 0.55);
    dummy.updateMatrix();
    roof.setMatrixAt(i, dummy.matrix);
    roof.setColorAt(i, color.setHex(lot.roof));

    dummy.position.set(lot.x, arch.stories === 2 ? arch.h * 0.72 : -8, lot.z);
    dummy.rotation.set(0, lot.rot, 0);
    dummy.scale.set(arch.w * 0.92, arch.stories === 2 ? arch.h * 0.45 : 0.01, arch.d * 0.7);
    dummy.updateMatrix();
    upper.setMatrixAt(i, dummy.matrix);
    upper.setColorAt(i, color.setHex(lot.color));

    dummy.position.set(lot.x, 0.12, lot.z);
    dummy.rotation.set(0, lot.rot, 0);
    dummy.scale.set(arch.w * 0.95, 0.16, 1.8);
    dummy.updateMatrix();
    deck.setMatrixAt(i, dummy.matrix);

    dummy.position.set(lot.x, arch.h * 0.52, lot.z);
    dummy.scale.set(arch.w * 0.46, arch.h * 0.28, 0.08);
    dummy.updateMatrix();
    glass.setMatrixAt(i, dummy.matrix);
  });
  if (body.instanceColor) body.instanceColor.needsUpdate = true;
  if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
  if (upper.instanceColor) upper.instanceColor.needsUpdate = true;

  scene.add(body, roof, upper, deck, glass);
  return { body, roof, upper, deck, glass };
}

function addPalms(scene: THREE.Scene) {
  const trunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.12, 0.18, 3.2, 5),
    new THREE.MeshLambertMaterial({ color: 0x6b5340 }),
    90,
  );
  const crown = new THREE.InstancedMesh(
    new THREE.ConeGeometry(1.3, 1.6, 5),
    new THREE.MeshLambertMaterial({ color: 0x4f7a4a, flatShading: true }),
    90,
  );
  const dummy = new THREE.Object3D();
  let i = 0;
  for (let r = 2; r < 15; r += 2) {
    for (let c = 3; c < 24; c += 3) {
      if (i >= 90) break;
      const x = c * WORLD.colW + 2.4;
      const z = r * WORLD.rowD + 3.2;
      dummy.position.set(x, 1.6, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      trunk.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 3.5, z);
      dummy.updateMatrix();
      crown.setMatrixAt(i, dummy.matrix);
      i += 1;
    }
  }
  scene.add(trunk, crown);
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getX?: () => number;
      getZ?: () => number;
      setKeys?: (codes: string[]) => void;
      setPose?: (x: number, z: number, yaw?: number) => void;
    };
  }
}
