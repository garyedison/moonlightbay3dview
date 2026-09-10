/** Tiny PDF 1.4 writer — ASCII only, Helvetica, landscape pages. */

function n(v: number) {
  return (Math.round(v * 100) / 100).toString();
}

function ascii(s: string) {
  return s
    .replace(/\u00b7/g, " | ")
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\u00d7/g, "x")
    .replace(/[^\x20-\x7E]/g, " ");
}

function esc(s: string) {
  return ascii(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

type Page = { w: number; h: number; ops: string[] };

export class PdfDoc {
  pages: Page[] = [];

  addPage(w = 792, h = 612) {
    this.pages.push({ w, h, ops: [] });
    return this;
  }

  private cur() {
    if (!this.pages.length) this.addPage();
    return this.pages[this.pages.length - 1];
  }

  fill(r: number, g: number, b: number) {
    this.cur().ops.push(`${n(r)} ${n(g)} ${n(b)} rg`);
    return this;
  }

  stroke(r: number, g: number, b: number) {
    this.cur().ops.push(`${n(r)} ${n(g)} ${n(b)} RG`);
    return this;
  }

  rect(x: number, y: number, w: number, h: number) {
    this.cur().ops.push(`${n(x)} ${n(y)} ${n(w)} ${n(h)} re f`);
    return this;
  }

  frame(x: number, y: number, w: number, h: number) {
    this.cur().ops.push(`${n(x)} ${n(y)} ${n(w)} ${n(h)} re S`);
    return this;
  }

  lineWidth(w: number) {
    this.cur().ops.push(`${n(w)} w`);
    return this;
  }

  text(str: string, x: number, y: number, size: number) {
    this.cur().ops.push(`BT /F1 ${n(size)} Tf ${n(x)} ${n(y)} Td (${esc(str)}) Tj ET`);
    return this;
  }

  blob(): Blob {
    const parts: string[] = ["%PDF-1.4\n"];
    const offsets = [0];
    const pushObj = (id: number, body: string) => {
      offsets[id] = parts.reduce((sum, p) => sum + p.length, 0);
      parts.push(`${id} 0 obj\n${body}\nendobj\n`);
    };

    const pageCount = this.pages.length;
    const fontId = 3;
    const firstPageId = 4;
    const kids = this.pages.map((_, i) => `${firstPageId + i * 2} 0 R`).join(" ");

    pushObj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    pushObj(2, `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
    pushObj(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

    this.pages.forEach((page, i) => {
      const pageId = firstPageId + i * 2;
      const contentId = pageId + 1;
      const stream = page.ops.join("\n");
      pushObj(
        pageId,
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(page.w)} ${n(page.h)}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
      );
      pushObj(contentId, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    });

    const xrefAt = parts.reduce((sum, p) => sum + p.length, 0);
    const maxId = firstPageId + pageCount * 2 - 1;
    let xref = `xref\n0 ${maxId + 1}\n`;
    xref += "0000000000 65535 f \n";
    for (let i = 1; i <= maxId; i++) {
      xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    parts.push(xref);
    parts.push(`trailer << /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`);
    return new Blob(parts, { type: "application/pdf" });
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
