// @ts-nocheck — reconstructed from the last good 360 engine; tour path added.
import * as THREE from "three";
import { LOTS, SITE, WORLD, lotArchetype, type Kind, type Lot, type PlanRoom } from "./community";
import { loadTex } from "./walk-interior";
import { hidePano, showPano, syncPano } from "./walk-pano";
import { panoKeyFor, panoRooms, type PanoRoom } from "./panos";
import { exteriorFor } from "./tours";

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
  getActiveRoom: () => string | null;
  playTour: () => void;
  stopTour: () => void;
  isTouring: () => boolean;
  onChange: (fn: () => void) => void;
};

const TEAK = 8018488;
export function mountWalk(canvas: HTMLCanvasElement): WalkApi {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		alpha: false
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setClearColor(12177364, 1);
	renderer.shadowMap.enabled = false;
	const scene = new THREE.Scene();
	scene.fog = new THREE.Fog(12177364, 80, 220);
	scene.background = new THREE.Color(12177364);
	const camera = new THREE.PerspectiveCamera(70, 1, .1, 400);
	const clock = new THREE.Clock();
	const world = new THREE.Group();
	world.name = "world";
	scene.add(world);
	scene.add(new THREE.HemisphereLight(15266034, 8022608, 1.05));
	const sun = new THREE.DirectionalLight(16773590, 1.15);
	sun.position.set(40, 70, 20);
	scene.add(sun);
	const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD.width + 40, WORLD.depth + 40), new THREE.MeshLambertMaterial({ color: 13351066 }));
	ground.rotation.x = -Math.PI / 2;
	ground.position.set(WORLD.width / 2, 0, WORLD.depth / 2);
	world.add(ground);
	addWater(world);
	addParks(world);
	addRoads(world);
	const houses = buildHouses(world);
	addFacades(world);
	addPalms(world);
	addLife(world);
	const selectRing = new THREE.Mesh(new THREE.RingGeometry(2.8, 3.3, 24), new THREE.MeshBasicMaterial({
		color: 15245626,
		side: THREE.DoubleSide
	}));
	selectRing.rotation.x = -Math.PI / 2;
	selectRing.position.y = .08;
	selectRing.visible = false;
	world.add(selectRing);
	let interiorRooms: PanoRoom[] = [];
	let activeRoom: string | null = null;
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	const keys = /* @__PURE__ */ new Set();
	let analogX = 0;
	let analogZ = 0;
	let mode: WalkMode = "dollhouse";
	let selected: number | null = 196;
	let insideLot: number | null = null;
	let floor = 1;
	let filter = "all";
	let yaw = .4;
	let pitch = -.72;
	let speed = 0;
	let orbitDist = 95;
	let dragging = false;
	let dragMoved = false;
	let lastX = 0;
	let lastY = 0;
	let listeners = [];
	let raf = 0;
	let running = true;
	const pos = new THREE.Vector3(WORLD.width * .45, 1.7, WORLD.depth * .4);
	const fwd = new THREE.Vector3();
	const right = new THREE.Vector3();
	const look = new THREE.Vector3();
	const orbitTarget = new THREE.Vector3(WORLD.width * .52, 0, WORLD.depth * .48);
	const walkTarget = new THREE.Vector3();
	let walkingTo = false;
	let touring = false;
	let tourIndex = 0;
	let tourTimer = 0;
	type TourStep =
		| { kind: "fly"; lot: number; dist: number; dur: number }
		| { kind: "walk"; lot: number; dur: number }
		| { kind: "enter"; lot: number; dur: number }
		| { kind: "room"; id: string; dur: number }
		| { kind: "spin"; dur: number };
	const TOUR: TourStep[] = [
		{ kind: "fly", lot: 330, dist: 42, dur: 5 },
		{ kind: "walk", lot: 330, dur: 3.5 },
		{ kind: "fly", lot: 103, dist: 30, dur: 5 },
		{ kind: "walk", lot: 103, dur: 3 },
		{ kind: "enter", lot: 103, dur: 0.6 },
		{ kind: "room", id: "kitchen", dur: 3.2 },
		{ kind: "spin", dur: 3 },
		{ kind: "room", id: "living", dur: 3 },
		{ kind: "room", id: "bed1", dur: 2.8 },
		{ kind: "fly", lot: 196, dist: 34, dur: 5 },
		{ kind: "walk", lot: 196, dur: 3 },
		{ kind: "enter", lot: 196, dur: 0.6 },
		{ kind: "room", id: "living", dur: 3.2 },
		{ kind: "spin", dur: 3 },
		{ kind: "room", id: "kitchen", dur: 3 },
		{ kind: "room", id: "bed1", dur: 3 },
	];
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
	function offsetXZ(lot, alongD) {
		return {
			x: lot.x + Math.sin(lot.rot) * alongD,
			z: lot.z + Math.cos(lot.rot) * alongD
		};
	}
	function writeLot(lot, i, hidden) {
		const arch = lotArchetype(lot);
		const vis = hidden ? .001 : 1;
		lotDummy.position.set(lot.x, hidden ? -20 : arch.h / 2, lot.z);
		lotDummy.rotation.set(0, lot.rot, 0);
		lotDummy.scale.set(arch.w * vis, arch.h * vis, arch.d * vis);
		lotDummy.updateMatrix();
		houses.body.setMatrixAt(i, lotDummy.matrix);
		lotDummy.position.set(lot.x, hidden || arch.kind !== "wood" ? -20 : arch.h + .28, lot.z);
		lotDummy.rotation.set(0, lot.rot + Math.PI / 4, 0);
		lotDummy.scale.set(arch.w * 1.2 * vis, .55 * vis, arch.d * .7 * vis);
		lotDummy.updateMatrix();
		houses.roof.setMatrixAt(i, lotDummy.matrix);
		lotDummy.position.set(lot.x, hidden || arch.stories !== 2 ? -20 : arch.h * .72, lot.z);
		lotDummy.rotation.set(0, lot.rot, 0);
		lotDummy.scale.set(arch.w * .92 * vis, (arch.stories === 2 ? arch.h * .45 : .01) * vis, arch.d * .7 * vis);
		lotDummy.updateMatrix();
		houses.upper.setMatrixAt(i, lotDummy.matrix);
		const deck = offsetXZ(lot, arch.d * .55 + .9);
		lotDummy.position.set(deck.x, hidden ? -20 : .12, deck.z);
		lotDummy.rotation.set(0, lot.rot, 0);
		lotDummy.scale.set(arch.w * .95 * vis, .16 * vis, 1.8 * vis);
		lotDummy.updateMatrix();
		houses.deck.setMatrixAt(i, lotDummy.matrix);
		const glass = offsetXZ(lot, arch.d * .51);
		lotDummy.position.set(glass.x, hidden ? -20 : arch.h * .52, glass.z);
		lotDummy.rotation.set(0, lot.rot, 0);
		lotDummy.scale.set(arch.w * .46 * vis, arch.h * .28 * vis, .08 * vis);
		lotDummy.updateMatrix();
		houses.glass.setMatrixAt(i, lotDummy.matrix);
	}
	function applyFilter() {
		LOTS.forEach((lot, i) => {
			const arch = lotArchetype(lot);
			writeLot(lot, i, !(filter === "all" || arch.kind === filter) || insideLot === lot.n);
		});
		houses.body.instanceMatrix.needsUpdate = true;
		houses.roof.instanceMatrix.needsUpdate = true;
		houses.upper.instanceMatrix.needsUpdate = true;
		houses.deck.instanceMatrix.needsUpdate = true;
		houses.glass.instanceMatrix.needsUpdate = true;
	}
	applyFilter();
	function selectLot(n) {
		selected = n;
		if (n == null) selectRing.visible = false;
		else {
			const lot = LOTS.find((l) => l.n === n);
			if (lot) {
				selectRing.visible = true;
				selectRing.position.set(lot.x, .08, lot.z);
			}
		}
		notify();
	}
	selectLot(196);
	function startTween(to, nextYaw) {
		tweenFrom.copy(pos);
		tweenTo.copy(to);
		tweenYawFrom = yaw;
		tweenYawTo = nextYaw;
		tweenT = 0;
	}
	function applyTourStep(step: TourStep) {
		const lotN = "lot" in step ? step.lot : insideLot ?? 196;
		const lot = LOTS.find((l) => l.n === lotN);
		if (step.kind === "fly" && lot) {
			insideLot = null;
			floor = 1;
			clearInterior();
			mode = "dollhouse";
			orbitTarget.set(lot.x, 0, lot.z);
			orbitDist = step.dist;
			pitch = -0.88;
			yaw = lot.rot + 0.6;
			applyFilter();
			selectLot(lot.n);
		} else if (step.kind === "walk" && lot) {
			insideLot = null;
			floor = 1;
			clearInterior();
			mode = "ground";
			pitch = 0;
			const front = offsetXZ(lot, lotArchetype(lot).d * 0.7 + 2.6);
			startTween(new THREE.Vector3(front.x, 1.65, front.z), lot.rot + Math.PI);
			selectLot(lot.n);
		} else if (step.kind === "enter") {
			enterLot(step.lot);
		} else if (step.kind === "room") {
			goRoom(step.id);
		}
		notify();
	}
	function playTour() {
		touring = true;
		tourIndex = 0;
		tourTimer = 0;
		applyTourStep(TOUR[0]);
	}
	function stopTour() {
		if (!touring) return;
		touring = false;
		notify();
	}

	function clearInterior() {
		hidePano(scene);
		world.visible = true;
		interiorRooms = [];
		activeRoom = null;
	}
	function enterLot(n) {
		const lot = LOTS.find((l) => l.n === n);
		if (!lot) return;
		selected = n;
		insideLot = n;
		floor = 1;
		mode = "inside";
		interiorRooms = panoRooms(lot.arch, lot.zone);
		activeRoom = (interiorRooms.find((r) => r.id === "kitchen") ?? interiorRooms.find((r) => r.id === "living") ?? interiorRooms[0])?.id ?? "kitchen";
		const key = panoKeyFor(activeRoom, lot.zone, lot.arch);
		pos.set(lot.x, 1.65, lot.z);
		yaw = 0;
		pitch = 0;
		walkingTo = false;
		world.visible = false;
		showPano(scene, key);
		syncPano(pos.x, pos.y, pos.z);
		applyFilter();
		selectLot(n);
		notify();
	}
	function goRoom(id) {
		if (!insideLot) return;
		const lot = LOTS.find((l) => l.n === insideLot);
		if (!lot) return;
		const key = interiorRooms.find((r) => r.id === id)?.pano ?? panoKeyFor(id, lot.zone, lot.arch);
		world.visible = false;
		showPano(scene, key);
		pos.set(lot.x, 1.65, lot.z);
		yaw = 0;
		pitch = 0;
		syncPano(pos.x, pos.y, pos.z);
		activeRoom = id;
		notify();
	}
	function setFloor(next) {
		if (!insideLot) return;
		const lot = LOTS.find((l) => l.n === insideLot);
		if (!lot) return;
		if (lotArchetype(lot).stories === 1) return;
		floor = next;
		goRoom(next === 2 ? "bed1" : "living");
	}
	function exitHouse() {
		const lot = insideLot != null ? LOTS.find((l) => l.n === insideLot) : null;
		insideLot = null;
		floor = 1;
		clearInterior();
		mode = "ground";
		if (lot) {
			const front = offsetXZ(lot, lotArchetype(lot).d * .7 + 2.4);
			pos.set(front.x, 1.65, front.z);
			yaw = lot.rot + Math.PI;
		}
		world.visible = true;
		hidePano(scene);
		applyFilter();
		notify();
	}
	function focusLot(n) {
		const lot = LOTS.find((l) => l.n === n);
		if (!lot) return;
		selectLot(n);
		orbitTarget.set(lot.x, 0, lot.z);
		if (mode === "dollhouse") {
			orbitDist = 28;
			pitch = -.85;
		} else if (mode === "ground") {
			const front = offsetXZ(lot, lotArchetype(lot).d * .7 + 2.4);
			startTween(new THREE.Vector3(front.x, 1.65, front.z), lot.rot + Math.PI);
		} else enterLot(n);
		notify();
	}
	function hitLot(clientX, clientY) {
		if (mode === "inside") return null;
		const rect = canvas.getBoundingClientRect();
		pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
		pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
		const hits = raycaster.intersectObject(houses.body);
		if (!hits.length) return null;
		const id = hits[0].instanceId;
		if (id == null) return null;
		return LOTS[id]?.n ?? null;
	}
	function hitGround(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
		pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
		const hits = raycaster.intersectObject(ground);
		if (!hits.length) return null;
		return hits[0].point;
	}
	function onPointerDown(ev) {
		dragging = true;
		dragMoved = false;
		lastX = ev.clientX;
		lastY = ev.clientY;
		canvas.setPointerCapture(ev.pointerId);
	}
	function onPointerMove(ev) {
		if (!dragging) return;
		const dx = ev.clientX - lastX;
		const dy = ev.clientY - lastY;
		if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
		lastX = ev.clientX;
		lastY = ev.clientY;
		if (mode === "dollhouse") {
			yaw -= dx * .005;
			pitch = THREE.MathUtils.clamp(pitch - dy * .004, -1.2, -.25);
		} else {
			yaw -= dx * .005;
			pitch = THREE.MathUtils.clamp(pitch - dy * .004, -1.35, 1.35);
		}
	}
	function onPointerUp(ev) {
		dragging = false;
		if (dragMoved) return;
		const n = hitLot(ev.clientX, ev.clientY);
		if (n != null) {
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
	function onWheel(ev) {
		if (mode !== "dollhouse") return;
		orbitDist = THREE.MathUtils.clamp(orbitDist + ev.deltaY * .04, 18, 160);
	}
	canvas.addEventListener("pointerdown", onPointerDown);
	canvas.addEventListener("pointermove", onPointerMove);
	canvas.addEventListener("pointerup", onPointerUp);
	canvas.addEventListener("wheel", onWheel, { passive: true });
	window.addEventListener("resize", resize);
	const onKeyDown = (e) => {
		keys.add(e.code);
		if (e.code === "Escape" && mode === "inside") exitHouse();
		if (e.code === "KeyE" && selected != null && mode !== "inside") enterLot(selected);
	};
	const onKeyUp = (e) => keys.delete(e.code);
	const onBlur = () => keys.clear();
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", onBlur);
	function blocked(nx, nz) {
		for (const lot of LOTS) {
			if (insideLot === lot.n) continue;
			const arch = lotArchetype(lot);
			if (Math.abs(nx - lot.x) < arch.w * .55 && Math.abs(nz - lot.z) < arch.d * .45) return true;
		}
		if (nz < 4) return true;
		if (nx < SITE.bankX + 2) return true;
		if (nx > SITE.bayX - 4) return true;
		if (nz > WORLD.depth - 6) return true;
		return false;
	}
	function tick() {
		if (!running) return;
		raf = requestAnimationFrame(tick);
		const dt = Math.min(clock.getDelta(), .1);
		if (tweenT < 1) {
			tweenT = Math.min(1, tweenT + dt / .55);
			const k = 1 - (1 - tweenT) * (1 - tweenT);
			pos.lerpVectors(tweenFrom, tweenTo, k);
			yaw = tweenYawFrom + (tweenYawTo - tweenYawFrom) * k;
		}
		fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
		right.set(Math.cos(yaw), 0, -Math.sin(yaw));
		const wantsWalk = keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD") || keys.has("ArrowUp") || keys.has("ArrowLeft") || keys.has("ArrowDown") || keys.has("ArrowRight") || Math.abs(analogX) + Math.abs(analogZ) > .04;
		if (touring) {
			if (wantsWalk || dragging) {
				stopTour();
			} else {
				const step = TOUR[tourIndex];
				tourTimer += dt;
				if (step?.kind === "spin" || step?.kind === "fly") yaw += 0.18 * dt;
				const dur = step?.dur ?? 3;
				if (tourTimer >= dur) {
					tourIndex += 1;
					tourTimer = 0;
					if (tourIndex >= TOUR.length) stopTour();
					else applyTourStep(TOUR[tourIndex]);
				}
			}
		}
		if (mode === "dollhouse" && wantsWalk && !touring) {
			mode = "ground";
			pos.set(orbitTarget.x, 1.65, orbitTarget.z + 6);
			pitch = 0;
			notify();
		}
		if (mode === "dollhouse") {
			camera.position.set(orbitTarget.x + Math.sin(yaw) * orbitDist, 18 + Math.cos(pitch) * (orbitDist * .55), orbitTarget.z + Math.cos(yaw) * orbitDist);
			camera.lookAt(orbitTarget.x, .4, orbitTarget.z);
			speed = 0;
		} else if (mode === "inside") {
			if (keys.has("KeyA") || keys.has("ArrowLeft")) yaw += 1.5 * dt;
			if (keys.has("KeyD") || keys.has("ArrowRight")) yaw -= 1.5 * dt;
			if (keys.has("KeyW") || keys.has("ArrowUp")) pitch = THREE.MathUtils.clamp(pitch + 1.1 * dt, -1.35, 1.35);
			if (keys.has("KeyS") || keys.has("ArrowDown")) pitch = THREE.MathUtils.clamp(pitch - 1.1 * dt, -1.35, 1.35);
			yaw -= analogX * 1.8 * dt;
			pitch = THREE.MathUtils.clamp(pitch - analogZ * 1.4 * dt, -1.35, 1.35);
			speed = 0;
			camera.position.copy(pos);
			syncPano(pos.x, pos.y, pos.z);
			look.copy(pos).addScaledVector(fwd, 6);
			look.y += Math.sin(pitch) * 6;
			camera.lookAt(look);
		} else {
			let mx = analogX;
			let mz = analogZ;
			if (keys.has("KeyW") || keys.has("ArrowUp")) mz += 1;
			if (keys.has("KeyS") || keys.has("ArrowDown")) mz -= 1;
			if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
			if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
			const moving = Math.abs(mx) + Math.abs(mz) > .04;
			const step = 7.4 * dt;
			if (moving) {
				walkingTo = false;
				const len = Math.hypot(mx, mz) || 1;
				mx /= len;
				mz /= len;
				const nx = pos.x + fwd.x * mz * step + right.x * mx * step;
				const nz = pos.z + fwd.z * mz * step + right.z * mx * step;
				if (!blocked(nx, pos.z)) pos.x = nx;
				if (!blocked(pos.x, nz)) pos.z = nz;
				speed = 7.4;
			} else if (walkingTo) {
				const dx = walkTarget.x - pos.x;
				const dz = walkTarget.z - pos.z;
				const dist = Math.hypot(dx, dz);
				if (dist < .3) walkingTo = false;
				else {
					const nx = pos.x + dx / dist * step;
					const nz = pos.z + dz / dist * step;
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
	const api = {
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
			mode = next;
			if (next === "dollhouse") {
				pitch = -.72;
				orbitDist = 95;
				orbitTarget.set(WORLD.width * .52, 0, WORLD.depth * .48);
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
		setPose(x, z, nextYaw) {
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
		getRooms: () => interiorRooms,
		getInsideLot: () => insideLot,
		getActiveRoom: () => activeRoom,
		playTour,
		stopTour,
		isTouring: () => touring,
		onChange(fn) {
			listeners.push(fn);
		}
	};
	if (new URLSearchParams(location.search).has("qa")) (window as Window & { __controlsTest?: object }).__controlsTest = {
		getYaw: () => yaw,
		getSpeed: () => speed,
		getX: () => pos.x,
		getZ: () => pos.z,
		setKeys: (codes) => api.setKeys(codes),
		setPose: (x, z, y) => api.setPose(x, z, y)
	};
	return api;
}
function addWater(scene) {
	const water = new THREE.MeshLambertMaterial({ color: 3108728 });
	const bayMat = new THREE.MeshLambertMaterial({ color: 3837846 });
	const mang = new THREE.MeshLambertMaterial({ color: 3099180 });
	const bank = new THREE.MeshLambertMaterial({ color: 12889736 });
	const mangrove = new THREE.Mesh(new THREE.PlaneGeometry(SITE.mangroveW + 10, WORLD.depth + 24), mang);
	mangrove.rotation.x = -Math.PI / 2;
	mangrove.position.set(SITE.mangroveX - 1, .03, WORLD.depth / 2);
	scene.add(mangrove);
	for (let i = 0; i < 10; i++) {
		const z = 8 + i * (WORLD.depth * .09);
		const x = SITE.canalX + Math.sin(i * .72) * 5.5;
		const seg = new THREE.Mesh(new THREE.PlaneGeometry(13 + Math.abs(Math.sin(i)) * 4, 22), water);
		seg.rotation.x = -Math.PI / 2;
		seg.rotation.z = Math.sin(i * .5) * .35;
		seg.position.set(x, -1.45, z);
		scene.add(seg);
	}
	const southArm = new THREE.Mesh(new THREE.PlaneGeometry(WORLD.width * .55, 16), water);
	southArm.rotation.x = -Math.PI / 2;
	southArm.position.set(WORLD.width * .38, -1.45, WORLD.depth - 2);
	scene.add(southArm);
	const bay = new THREE.Mesh(new THREE.PlaneGeometry(SITE.bayW, WORLD.depth + 50), bayMat);
	bay.rotation.x = -Math.PI / 2;
	bay.position.set(SITE.bayX + SITE.bayW * .38, -.35, WORLD.depth / 2);
	scene.add(bay);
	const bankMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.5, WORLD.depth * .9), bank);
	bankMesh.position.set(SITE.bankX, -.55, WORLD.depth * .46);
	scene.add(bankMesh);
	const beach = new THREE.Mesh(new THREE.PlaneGeometry(14, WORLD.depth * .9), new THREE.MeshLambertMaterial({ color: 14271642 }));
	beach.rotation.x = -Math.PI / 2;
	beach.position.set(SITE.bayX - 4, .04, WORLD.depth * .5);
	scene.add(beach);
}
function addParks(scene) {
	const mat = new THREE.MeshLambertMaterial({ color: 8034922 });
	for (const [x, z, w, d] of [
		[
			73.8,
			85.5,
			16,
			14
		],
		[
			14.5 * 8.2,
			4.5 * 11.4,
			14,
			14
		],
		[
			14.5 * 8.2,
			131.1,
			28,
			16
		]
	]) {
		const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
		m.rotation.x = -Math.PI / 2;
		m.position.set(x, .03, z);
		scene.add(m);
	}
}
function addRoads(scene) {
	const mat = new THREE.MeshLambertMaterial({ color: 12035461 });
	const gateRoad = new THREE.Mesh(new THREE.PlaneGeometry(6.5, WORLD.depth * .72), mat);
	gateRoad.rotation.x = -Math.PI / 2;
	gateRoad.position.set(4.6 * 8.2, .02, WORLD.depth * .42);
	scene.add(gateRoad);
	const spine = new THREE.Mesh(new THREE.PlaneGeometry(WORLD.width * .62, 5.5), mat);
	spine.rotation.x = -Math.PI / 2;
	spine.position.set(WORLD.width * .52, .02, 2.2 * 11.4);
	scene.add(spine);
	const mid = new THREE.Mesh(new THREE.PlaneGeometry(WORLD.width * .55, 5), mat);
	mid.rotation.x = -Math.PI / 2;
	mid.position.set(WORLD.width * .55, .02, 114);
	scene.add(mid);
}
function addFacades(scene: THREE.Object3D) {
	for (const lot of LOTS) {
		const arch = lotArchetype(lot);
		const url = exteriorFor(lot.n, lot.arch);
		const mat = new THREE.MeshBasicMaterial({
			map: loadTex(url),
			toneMapped: false
		});
		mat.userData.keep = true;
		const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
		const along = arch.d * .52 + .12;
		plane.position.set(lot.x + Math.sin(lot.rot) * along, arch.h * .52, lot.z + Math.cos(lot.rot) * along);
		plane.rotation.y = lot.rot;
		plane.scale.set(Math.max(arch.w * 1.25, 4.6), Math.max(arch.h * 1.15, 3.4), 1);
		scene.add(plane);
	}
}
function addLife(scene) {
	const hull = new THREE.MeshLambertMaterial({ color: 12868670 });
	const hull2 = new THREE.MeshLambertMaterial({ color: 15986404 });
	const skin = new THREE.MeshLambertMaterial({ color: 12887412 });
	const cloth = new THREE.MeshLambertMaterial({ color: 2906196 });
	const kayaks = [
		[
			SITE.canalX - 1.4,
			WORLD.depth * .28,
			.4,
			hull
		],
		[
			SITE.canalX + 1.1,
			WORLD.depth * .36,
			-.6,
			hull2
		],
		[
			SITE.canalX - .4,
			WORLD.depth * .48,
			1.1,
			hull
		],
		[
			SITE.canalX + 2.2,
			WORLD.depth * .58,
			.2,
			hull2
		],
		[
			SITE.canalX,
			WORLD.depth * .72,
			-.9,
			hull
		]
	];
	for (const [x, z, rot, mat] of kayaks) {
		const k = new THREE.Mesh(new THREE.CapsuleGeometry(.22, 1.8, 4, 8), mat);
		k.rotation.z = Math.PI / 2;
		k.rotation.y = rot;
		k.position.set(x, -1.22, z);
		scene.add(k);
		const person = new THREE.Mesh(new THREE.CapsuleGeometry(.12, .45, 3, 6), skin);
		person.position.set(x, -.85, z);
		scene.add(person);
	}
	const fisher = new THREE.Group();
	fisher.add(new THREE.Mesh(new THREE.CapsuleGeometry(.16, .7, 4, 6), skin));
	const shirt = new THREE.Mesh(new THREE.BoxGeometry(.42, .45, .28), cloth);
	shirt.position.y = .15;
	fisher.add(shirt);
	fisher.position.set(SITE.bankX + 1.2, .9, WORLD.depth * .44);
	scene.add(fisher);
	const rod = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 2.4, 5), new THREE.MeshLambertMaterial({ color: 6045747 }));
	rod.position.set(SITE.bankX + .4, 1.4, WORLD.depth * .44);
	rod.rotation.z = .9;
	scene.add(rod);
	const stepMat = new THREE.MeshLambertMaterial({ color: TEAK });
	for (const z of [
		34.2,
		79.8,
		125.4
	]) for (let i = 0; i < 5; i++) {
		const s = new THREE.Mesh(new THREE.BoxGeometry(1.4, .14, .55), stepMat);
		s.position.set(SITE.bankX - .2 - i * .55, .05 - i * .32, z);
		scene.add(s);
	}
}
function buildHouses(scene) {
	const n = LOTS.length;
	const steelMap = loadTex("/pano/skin-steel.jpg");
	const body = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 16777215 }), n);
	const roof = new THREE.InstancedMesh(new THREE.ConeGeometry(.75, 1, 4), new THREE.MeshLambertMaterial({
		color: 16777215,
		flatShading: true,
		map: steelMap
	}), n);
	const upper = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ map: steelMap }), n);
	const deck = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: TEAK }), n);
	const glass = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 10405056 }), n);
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
		dummy.position.set(lot.x, arch.kind === "wood" ? arch.h + .28 : -8, lot.z);
		dummy.rotation.set(0, lot.rot + Math.PI / 4, 0);
		dummy.scale.set(arch.w * 1.2, .55, arch.d * .7);
		dummy.updateMatrix();
		roof.setMatrixAt(i, dummy.matrix);
		roof.setColorAt(i, color.setHex(lot.roof));
		dummy.position.set(lot.x, arch.stories === 2 ? arch.h * .72 : -8, lot.z);
		dummy.rotation.set(0, lot.rot, 0);
		dummy.scale.set(arch.w * .92, arch.stories === 2 ? arch.h * .45 : .01, arch.d * .7);
		dummy.updateMatrix();
		upper.setMatrixAt(i, dummy.matrix);
		upper.setColorAt(i, color.setHex(15199464));
		dummy.position.set(lot.x, .12, lot.z);
		dummy.rotation.set(0, lot.rot, 0);
		dummy.scale.set(arch.w * .95, .16, 1.8);
		dummy.updateMatrix();
		deck.setMatrixAt(i, dummy.matrix);
		dummy.position.set(lot.x, arch.h * .52, lot.z);
		dummy.scale.set(arch.w * .46, arch.h * .28, .08);
		dummy.updateMatrix();
		glass.setMatrixAt(i, dummy.matrix);
	});
	if (body.instanceColor) body.instanceColor.needsUpdate = true;
	if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
	if (upper.instanceColor) upper.instanceColor.needsUpdate = true;
	scene.add(body, roof, upper, deck, glass);
	return {
		body,
		roof,
		upper,
		deck,
		glass
	};
}
function addPalms(scene) {
	const n = 70;
	const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(.12, .18, 3.2, 5), new THREE.MeshLambertMaterial({ color: 7033664 }), n);
	const crown = new THREE.InstancedMesh(new THREE.ConeGeometry(1.3, 1.6, 5), new THREE.MeshLambertMaterial({
		color: 5208650,
		flatShading: true
	}), n);
	const bush = new THREE.InstancedMesh(new THREE.SphereGeometry(.7, 6, 5), new THREE.MeshLambertMaterial({
		color: 6060616,
		flatShading: true
	}), 80);
	const dummy = new THREE.Object3D();
	let i = 0;
	const palmSpots = [];
	for (let r = 2; r < 15; r += 2) {
		palmSpots.push([SITE.bankX + 2.2, r * WORLD.rowD + 1.4]);
		palmSpots.push([SITE.bayX - 6.5, r * WORLD.rowD + 2.1]);
	}
	for (let r = 3; r < 14; r += 3) palmSpots.push([12 * WORLD.colW, r * WORLD.rowD]);
	for (const [x, z] of palmSpots) {
		if (i >= n) break;
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
	let b = 0;
	for (let r = 2; r < 15; r += 1) {
		if (b >= 80) break;
		dummy.position.set(SITE.bankX + 1.1 + r % 2 * .8, .45, r * WORLD.rowD + 3);
		dummy.scale.setScalar(.7 + r % 3 * .15);
		dummy.updateMatrix();
		bush.setMatrixAt(b, dummy.matrix);
		b += 1;
	}
	scene.add(trunk, crown, bush);
}
