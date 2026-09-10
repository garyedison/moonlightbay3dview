import { ARCH, FEATURED_LOTS, LOTS, SITE, WORLD, ZONE_LABEL, counts, lotArchetype } from "./community";
import { PdfDoc, downloadBlob } from "./pdf-kit";

const INK = { r: 0.11, g: 0.13, b: 0.12 };
const MUTED = { r: 0.42, g: 0.39, b: 0.35 };
const PAPER = { r: 0.98, g: 0.97, b: 0.95 };
const STEEL = { r: 0.173, g: 0.345, b: 0.329 };
const WOOD = { r: 0.478, g: 0.353, b: 0.22 };
const WATER = { r: 0.369, g: 0.604, b: 0.659 };
const PARK = { r: 0.478, g: 0.604, b: 0.416 };
const SAND = { r: 0.839, g: 0.769, b: 0.647 };
const GOLD = { r: 0.91, g: 0.63, b: 0.23 };

export function communityMapSvg() {
  const pad = 24;
  const w = 1100;
  const h = 820;
  const sx = (WORLD.width + 20) / (w - pad * 2);
  const sy = (WORLD.depth + 24) / (h - pad * 2 - 70);
  const s = Math.max(sx, sy);
  const xOf = (x: number) => pad + x / s;
  const yOf = (z: number) => pad + 52 + z / s;
  const stats = counts();

  const houses = LOTS.map((lot) => {
    const arch = lotArchetype(lot);
    const fill = arch.kind === "steel" ? "#2c5854" : "#7a5a38";
    const bw = Math.max(5.2, arch.w / s);
    const bd = Math.max(4.0, arch.d / s);
    const featured = FEATURED_LOTS.has(lot.n);
    const label = featured
      ? `<text x="${xOf(lot.x).toFixed(1)}" y="${(yOf(lot.z) + 2.4).toFixed(1)}" text-anchor="middle" font-size="6" fill="#faf7f1" font-family="system-ui">${lot.n}</text>`
      : "";
    return `<rect x="${(xOf(lot.x) - bw / 2).toFixed(1)}" y="${(yOf(lot.z) - bd / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bd.toFixed(1)}" fill="${fill}" rx="0.8"/>${label}`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#faf7f1"/>
  <text x="${pad}" y="28" font-family="Georgia, serif" font-size="22" fill="#1c211f">Moonlight Bay de Consejo — built-out community</text>
  <text x="${pad}" y="48" font-family="system-ui, sans-serif" font-size="12" fill="#6b6458">Schematic 3D model, not a survey. ${stats.total} homes · ${stats.steel} steel container · ${stats.wood} wood. Confirm lots with the developer.</text>
  <rect x="${xOf(SITE.mangroveX - 4)}" y="${yOf(-2)}" width="${(SITE.mangroveW + 2) / s}" height="${(WORLD.depth + 4) / s}" fill="#3a5536"/>
  <rect x="${xOf(SITE.canalX - SITE.canalW / 2)}" y="${yOf(4)}" width="${SITE.canalW / s}" height="${(WORLD.depth - 10) / s}" fill="#3e7a86"/>
  <text x="${xOf(SITE.canalX)}" y="${yOf(WORLD.depth * 0.4)}" text-anchor="middle" font-size="9" fill="#faf7f1" font-family="Georgia, serif">CANAL</text>
  <rect x="${xOf(SITE.bayX)}" y="${yOf(-8)}" width="${SITE.bayW / s}" height="${(WORLD.depth + 16) / s}" fill="#4e8f9c"/>
  <text x="${xOf(SITE.bayX + 10)}" y="${yOf(WORLD.depth / 2)}" font-size="10" fill="#faf7f1" font-family="Georgia, serif">CHETUMAL BAY</text>
  ${houses}
  <g font-family="system-ui, sans-serif" font-size="12" fill="#1c211f">
    <rect x="${w - 230}" y="${h - 78}" width="12" height="12" fill="#2c5854"/>
    <text x="${w - 212}" y="${h - 67}">Steel container</text>
    <rect x="${w - 230}" y="${h - 56}" width="12" height="12" fill="#7a5a38"/>
    <text x="${w - 212}" y="${h - 45}">Wood home</text>
    <rect x="${w - 230}" y="${h - 34}" width="12" height="12" fill="#5e9aa8"/>
    <text x="${w - 212}" y="${h - 23}">Water</text>
  </g>
</svg>`;
}

export function downloadCommunitySvg() {
  downloadBlob(new Blob([communityMapSvg()], { type: "image/svg+xml" }), "moonlight-bay-community-map.svg");
}


export function buildCommunityPdf(): Blob {
  const stats = counts();
  const pdf = new PdfDoc();
  const W = 792;
  const H = 612;
  const pad = 28;
  const mapTop = 78;
  const mapH = 470;
  const mapW = W - pad * 2;
  const sx = mapW / (WORLD.width + 16);
  const sy = mapH / (WORLD.depth + 18);
  const s = Math.min(sx, sy);
  const ox = pad + 8;
  const oy = H - mapTop - 8;

  const X = (x: number) => ox + x * s;
  const Y = (z: number) => oy - z * s;

  pdf.addPage(W, H);
  pdf.fill(PAPER.r, PAPER.g, PAPER.b).rect(0, 0, W, H);
  pdf.fill(INK.r, INK.g, INK.b).text("Moonlight Bay de Consejo", pad, H - 28, 18);
  pdf.fill(MUTED.r, MUTED.g, MUTED.b).text(
    `Built-out plat  ·  ${stats.total} homes  ·  ${stats.steel} steel container  ·  ${stats.wood} wood  ·  schematic, not a survey`,
    pad,
    H - 44,
    9,
  );

  pdf.fill(0.227, 0.333, 0.212).rect(X(SITE.mangroveX - 4), Y(WORLD.depth), (SITE.mangroveW + 2) * s, (WORLD.depth + 4) * s);
  pdf.fill(WATER.r * 0.9, WATER.g * 0.95, WATER.b).rect(X(SITE.canalX - SITE.canalW / 2), Y(WORLD.depth - 4), SITE.canalW * s, (WORLD.depth - 10) * s);
  pdf.fill(INK.r, INK.g, INK.b).text("CANAL", X(SITE.canalX - 8), Y(WORLD.depth * 0.45), 8);
  pdf.fill(WATER.r, WATER.g, WATER.b).rect(X(SITE.bayX), Y(WORLD.depth + 8), SITE.bayW * s, (WORLD.depth + 16) * s);
  pdf.fill(INK.r, INK.g, INK.b).text("CHETUMAL BAY", X(SITE.bayX + 4), Y(WORLD.depth * 0.5), 8);

  pdf.fill(PARK.r, PARK.g, PARK.b);
  pdf.rect(X(8 * 8.2), Y(8.4 * 11.4), 16 * s, 14 * s);
  pdf.rect(X(13.5 * 8.2), Y(5.6 * 11.4), 14 * s, 14 * s);
  pdf.rect(X(13 * 8.2), Y(12.6 * 11.4), 28 * s, 16 * s);

  pdf.fill(SAND.r, SAND.g, SAND.b).rect(X(4.2 * 8.2), Y(WORLD.depth * 0.72), 6.5 * s, WORLD.depth * 0.72 * s);

  for (const lot of LOTS) {
    const arch = lotArchetype(lot);
    const c = arch.kind === "steel" ? STEEL : WOOD;
    const bw = Math.max(3.6, arch.w * s * 0.85);
    const bd = Math.max(2.8, arch.d * s * 0.22);
    pdf.fill(c.r, c.g, c.b).rect(X(lot.x) - bw / 2, Y(lot.z) - bd / 2, bw, bd);
    if (FEATURED_LOTS.has(lot.n)) {
      pdf.fill(GOLD.r, GOLD.g, GOLD.b).text(String(lot.n), X(lot.x) - 6, Y(lot.z) + 1, 5);
    }
  }

  pdf.fill(STEEL.r, STEEL.g, STEEL.b).rect(pad, 36, 10, 10);
  pdf.fill(INK.r, INK.g, INK.b).text("Steel container", pad + 16, 38, 8);
  pdf.fill(WOOD.r, WOOD.g, WOOD.b).rect(pad + 120, 36, 10, 10);
  pdf.fill(INK.r, INK.g, INK.b).text("Wood home", pad + 136, 38, 8);
  pdf.fill(WATER.r, WATER.g, WATER.b).rect(pad + 220, 36, 10, 10);
  pdf.fill(INK.r, INK.g, INK.b).text("Water", pad + 236, 38, 8);
  pdf.fill(MUTED.r, MUTED.g, MUTED.b).text(
    "Planning model only. Gold labels are featured beach, canal, gate, park, and street lots. Confirm availability with the developer.",
    pad,
    22,
    7,
  );

  pdf.addPage(W, H);
  pdf.fill(PAPER.r, PAPER.g, PAPER.b).rect(0, 0, W, H);
  pdf.fill(INK.r, INK.g, INK.b).text("Models on the plat", pad, H - 28, 16);
  pdf.fill(MUTED.r, MUTED.g, MUTED.b).text(
    "Every lot is assigned one of eight shells. Steel is container. Wood is stick-frame. Interiors share the Caribbean Salt kit.",
    pad,
    H - 44,
    9,
  );

  const models = Object.values(ARCH);
  models.forEach((arch, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = pad + col * 370;
    const y = H - 80 - row * 120;
    const c = arch.kind === "steel" ? STEEL : WOOD;
    pdf.fill(c.r, c.g, c.b).rect(x, y - 8, 14, 14);
    pdf.fill(INK.r, INK.g, INK.b).text(arch.name, x + 22, y - 4, 12);
    pdf.fill(MUTED.r, MUTED.g, MUTED.b);
    pdf.text(`${arch.kind === "steel" ? "Container steel" : "Wood"}  ·  ${arch.size}  ·  ${arch.beds}  ·  ${arch.area}`, x + 22, y - 20, 8);
    pdf.text(arch.plan.map((r) => r.name).join("  ·  "), x + 22, y - 34, 8);
    pdf.text(`${stats.byArch[arch.id] ?? 0} lots on this plat`, x + 22, y - 48, 8);
  });

  const rowsPerPage = 42;
  const cols = 2;
  const perPage = rowsPerPage * cols;
  const sorted = [...LOTS].sort((a, b) => a.n - b.n);
  const pages = Math.ceil(sorted.length / perPage);

  for (let p = 0; p < pages; p++) {
    pdf.addPage(W, H);
    pdf.fill(PAPER.r, PAPER.g, PAPER.b).rect(0, 0, W, H);
    pdf.fill(INK.r, INK.g, INK.b).text(`Lot schedule  ·  page ${p + 1} of ${pages}`, pad, H - 28, 14);
    pdf.fill(MUTED.r, MUTED.g, MUTED.b).text("Lot, zone, shell, beds. Click the same lot in the 3D walk to step inside.", pad, H - 44, 9);

    for (let c = 0; c < cols; c++) {
      const hx = pad + c * 380;
      pdf.fill(INK.r, INK.g, INK.b);
      pdf.text("Lot", hx, H - 64, 8);
      pdf.text("Zone", hx + 40, H - 64, 8);
      pdf.text("Kind", hx + 110, H - 64, 8);
      pdf.text("Model", hx + 160, H - 64, 8);
      pdf.text("Beds", hx + 270, H - 64, 8);
    }

    for (let i = 0; i < perPage; i++) {
      const lot = sorted[p * perPage + i];
      if (!lot) break;
      const arch = lotArchetype(lot);
      const c = i < rowsPerPage ? 0 : 1;
      const row = i % rowsPerPage;
      const x = pad + c * 380;
      const y = H - 78 - row * 12;
      const rgb = arch.kind === "steel" ? STEEL : WOOD;
      pdf.fill(rgb.r, rgb.g, rgb.b).rect(x, y - 1, 6, 6);
      pdf.fill(INK.r, INK.g, INK.b);
      pdf.text(String(lot.n), x + 10, y, 8);
      pdf.text(ZONE_LABEL[lot.zone], x + 40, y, 8);
      pdf.text(arch.kind === "steel" ? "Steel" : "Wood", x + 110, y, 8);
      pdf.text(arch.name, x + 160, y, 8);
      pdf.text(arch.beds, x + 270, y, 7);
    }
  }

  return pdf.blob();
}

export function downloadCommunityPdf() {
  downloadBlob(buildCommunityPdf(), "Moonlight-Bay-community-map.pdf");
}

export function printCommunityPdf() {
  downloadCommunityPdf();
}
