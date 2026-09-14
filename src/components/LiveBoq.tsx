import { useMemo, useState } from "react";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usd, type QuoteStyle } from "@/lib/quote";
import {
  BOQ_STYLES,
  PRESETS,
  SECTION_COPY,
  SECTION_ORDER,
  childrenOf,
  defaultOn,
  displayLines,
  isFfeParent,
  liveLines,
  parentOfChild,
  presetIds,
  sectionTotal,
  sumOn,
  type LiveLine,
  type LiveSection,
  type PresetId,
} from "@/lib/live-quote";
import { cn } from "@/lib/utils";

export function LiveBoq({ initial = BOQ_STYLES[0] }: { initial?: QuoteStyle }) {
  const [styleId, setStyleId] = useState(initial.id);
  const style = BOQ_STYLES.find((s) => s.id === styleId) ?? initial;
  const lines = useMemo(() => liveLines(style), [style]);
  const [on, setOn] = useState<Set<string>>(() => defaultOn(style));
  const [openFfe, setOpenFfe] = useState<string | null>(null);
  const [preset, setPreset] = useState<PresetId | "custom">("furnished");

  const presetTotals = useMemo(() => {
    const map = {} as Record<PresetId, number>;
    for (const p of PRESETS) {
      map[p.id] = sumOn(lines, new Set(presetIds(style, p.id, lines)));
    }
    return map;
  }, [style, lines]);

  function applyStyle(next: QuoteStyle) {
    setStyleId(next.id);
    const nextLines = liveLines(next);
    setOn(new Set(presetIds(next, "furnished", nextLines)));
    setPreset("furnished");
    setOpenFfe(null);
  }

  function applyPreset(id: PresetId) {
    setPreset(id);
    setOn(new Set(presetIds(style, id, lines)));
    setOpenFfe(null);
  }

  function toggle(id: string) {
    setPreset("custom");
    setOn((prev) => {
      const next = new Set(prev);
      const isOn = next.has(id);
      if (isFfeParent(id)) {
        const kids = childrenOf(id, lines);
        if (isOn) {
          next.delete(id);
          for (const k of kids) next.delete(k.id);
        } else {
          next.add(id);
          for (const k of kids) next.add(k.id);
        }
        return next;
      }
      if (id.includes("-CS-")) {
        const parent = parentOfChild(id);
        const kids = childrenOf(parent, lines);
        if (isOn) next.delete(id);
        else next.add(id);
        const any = kids.some((k) => next.has(k.id));
        const all = kids.every((k) => next.has(k.id));
        if (all && any) next.add(parent);
        else next.delete(parent);
        return next;
      }
      if (isOn) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSection(section: LiveSection) {
    const rows = displayLines(lines).filter((l) => l.section === section);
    const allOn = rows.every((l) => on.has(l.id) || childrenOf(l.id, lines).some((k) => on.has(k.id)));
    setPreset("custom");
    setOn((prev) => {
      const next = new Set(prev);
      for (const row of rows) {
        const kids = childrenOf(row.id, lines);
        if (allOn) {
          next.delete(row.id);
          for (const k of kids) next.delete(k.id);
        } else {
          next.add(row.id);
          for (const k of kids) next.add(k.id);
        }
      }
      return next;
    });
  }

  const total = sumOn(lines, on);
  const landed = sectionTotal(lines, on, "landed");
  const civil = sectionTotal(lines, on, "civil");

  return (
    <section id="boq" className="mt-14 scroll-mt-24">
      <p className="text-xs tracking-[0.2em] text-teak uppercase">Build your price · Lot 115</p>
      <h3 className="mt-2 font-display text-3xl text-ink">Add or take away any line</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Start from the shell landed in Belize. Turn on civil and MEP, the deck, assembly, or
        furniture room by room. Uncheck a sofa if you only want the shell. Lot cost is separate.
        Working draft — not a contract.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {BOQ_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => applyStyle(s)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm",
              s.id === style.id ? "bg-lagoon text-salt" : "bg-salt text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className={cn(
              "min-h-11 rounded-xl px-4 py-3 text-left",
              preset === p.id ? "bg-ink text-salt" : "bg-paper text-ink shadow-[0_0_0_1px_rgba(28,33,31,0.12)]",
            )}
          >
            <span className="block text-sm">{p.label}</span>
            <span className={cn("mt-1 block font-display text-xl tabular-nums", preset === p.id ? "text-salt" : "text-ink")}>
              {usd(presetTotals[p.id])}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        {preset === "custom" ? "Custom mix — numbers update as you check lines." : PRESETS.find((p) => p.id === preset)?.hint}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4">
          {SECTION_ORDER.map((section) => {
            const rows = displayLines(lines).filter((l) => l.section === section);
            const copy = SECTION_COPY[section];
            const sub = sectionTotal(lines, on, section);
            return (
              <article key={section} className="rounded-xl bg-surface p-5 shadow-border sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-2xl text-ink">{copy.title}</h4>
                    <p className="mt-1 text-sm text-muted">{copy.blurb}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="tabular-nums text-sm text-ink">{usd(sub)}</p>
                    <Button type="button" size="sm" variant="outline" onClick={() => toggleSection(section)}>
                      {sub > 0 ? "Remove group" : "Add group"}
                    </Button>
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-line">
                  {rows.map((row) => (
                    <LineRow
                      key={row.id}
                      row={row}
                      lines={lines}
                      on={on}
                      open={openFfe === row.id}
                      onToggle={() => toggle(row.id)}
                      onToggleChild={(id) => toggle(id)}
                      onOpen={() => setOpenFfe((v) => (v === row.id ? null : row.id))}
                    />
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className="rounded-xl bg-ink p-6 text-salt shadow-border lg:sticky lg:top-24">
          <p className="text-xs tracking-[0.18em] text-sand uppercase">{style.name} · Lot 115</p>
          <p className="mt-2 font-display text-4xl">{usd(total)}</p>
          <p className="mt-1 text-sm text-sand/80">Your build, as checked</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-sand/80">Landed shell</dt>
              <dd className="tabular-nums">{usd(landed)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-sand/80">Civil and MEP</dt>
              <dd className="tabular-nums">{usd(civil)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-sand/80">On the lot</dt>
              <dd className="tabular-nums">{usd(sectionTotal(lines, on, "site"))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-sand/80">Assembly</dt>
              <dd className="tabular-nums">{usd(sectionTotal(lines, on, "labor"))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-sand/80">FF&E</dt>
              <dd className="tabular-nums">{usd(sectionTotal(lines, on, "ffe"))}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-sand/70">
            Shell landed is the factory house plus ocean freight and inland. Civil is the slab and
            excavation. MEP is electrical, plumbing, and septic. Lot is not in this number.
          </p>
        </aside>
      </div>
    </section>
  );
}

function LineRow({
  row,
  lines,
  on,
  open,
  onToggle,
  onToggleChild,
  onOpen,
}: {
  row: LiveLine;
  lines: LiveLine[];
  on: Set<string>;
  open: boolean;
  onToggle: () => void;
  onToggleChild: (id: string) => void;
  onOpen: () => void;
}) {
  const kids = childrenOf(row.id, lines);
  const childOn = kids.filter((k) => on.has(k.id));
  const mixed = kids.length > 0 && childOn.length > 0 && childOn.length < kids.length;
  const checked = on.has(row.id) || childOn.length > 0;
  const amount =
    childOn.length > 0 ? childOn.reduce((s, k) => s + k.amount, 0) : checked ? row.amount : 0;

  return (
    <li className="py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={mixed ? "mixed" : checked}
          onClick={onToggle}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-sm",
              checked ? "bg-lagoon text-salt" : "bg-paper shadow-[0_0_0_1px_rgba(28,33,31,0.2)]",
              mixed && "bg-glass text-ink",
            )}
          >
            {mixed ? (
              <Minus className="size-3.5" strokeWidth={2.5} />
            ) : checked ? (
              <Check className="size-3.5" strokeWidth={2.5} />
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block text-sm", checked ? "text-ink" : "text-muted line-through")}>
              {row.label}
            </span>
            {row.hint && !isFfeParent(row.id) ? (
              <span className="block text-xs text-muted">{row.hint}</span>
            ) : null}
          </span>
          <span className={cn("shrink-0 tabular-nums text-sm", checked ? "text-ink" : "text-muted")}>
            {usd(amount)}
          </span>
        </button>
        {kids.length > 0 ? (
          <Button type="button" size="sm" variant="ghost" onClick={onOpen} className="shrink-0">
            {open ? "Hide" : "Items"}
          </Button>
        ) : null}
      </div>
      {open && kids.length > 0 ? (
        <ul className="mt-1 ml-8">
          {kids.map((k) => {
            const kidOn = on.has(k.id);
            return (
              <li key={k.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={kidOn}
                  onClick={() => onToggleChild(k.id)}
                  className="flex min-h-11 w-full items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-sm",
                      kidOn ? "bg-lagoon text-salt" : "bg-paper shadow-[0_0_0_1px_rgba(28,33,31,0.2)]",
                    )}
                  >
                    {kidOn ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                  </span>
                  <span className={cn("flex-1 text-sm", kidOn ? "text-ink" : "text-muted line-through")}>
                    {k.label}
                  </span>
                  <span className={cn("tabular-nums text-sm", kidOn ? "text-ink" : "text-muted")}>
                    {usd(k.amount)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
