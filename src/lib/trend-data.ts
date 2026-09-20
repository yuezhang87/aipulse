import { Story } from "@/types/story";
import { CATEGORY_ORDER } from "@/lib/category-colors";

export interface NamedCount {
  name: string;
  count: number;
}

export interface MonthCount {
  label: string;
  count: number;
}

export function countByCategory(stories: Story[]): NamedCount[] {
  const counts = new Map<string, number>();
  for (const s of stories) {
    counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function countByMonth(stories: Story[]): MonthCount[] {
  const counts = new Map<string, number>();
  for (const s of stories) {
    const d = new Date(s.publishedAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([key, count]) => {
      const [year, month] = key.split("-");
      return { label: `${MONTH_LABELS[Number(month) - 1]} ${year.slice(2)}`, count, key };
    })
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ label, count }) => ({ label, count }));
}

export function countBySource(stories: Story[]): NamedCount[] {
  const counts = new Map<string, number>();
  for (const s of stories) {
    counts.set(s.source, (counts.get(s.source) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export interface MomentumRow {
  category: string;
  series: number[];
  current: number;
  delta: number;
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Buckets every story into a monthly count per category, from the earliest to the latest tracked signal. */
export function computeMomentum(stories: Story[]): { months: string[]; rows: MomentumRow[] } {
  if (stories.length === 0) return { months: [], rows: [] };

  const times = stories.map((s) => new Date(s.publishedAt).getTime());
  const min = new Date(Math.min(...times));
  const max = new Date(Math.max(...times));

  const monthKeys: string[] = [];
  const monthLabels: string[] = [];
  const cursor = new Date(Date.UTC(min.getUTCFullYear(), min.getUTCMonth(), 1));
  const end = new Date(Date.UTC(max.getUTCFullYear(), max.getUTCMonth(), 1));
  while (cursor.getTime() <= end.getTime()) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
    monthKeys.push(key);
    monthLabels.push(`${SHORT_MONTHS[cursor.getUTCMonth()]} ${String(cursor.getUTCFullYear()).slice(2)}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const rows: MomentumRow[] = CATEGORY_ORDER.map((category) => {
    const series = monthKeys.map(
      (key) => stories.filter((s) => s.category === category && s.publishedAt.startsWith(key)).length
    );
    const current = series[series.length - 1] ?? 0;
    const prev = series.length > 1 ? series[series.length - 2] : 0;
    return { category, series, current, delta: current - prev };
  });

  return { months: monthLabels, rows };
}

/** Auto-drafted paragraph summarizing which themes are accelerating, flat, or new. */
export function buildMomentumDigest(months: string[], rows: MomentumRow[], totalSignals: number): string {
  if (months.length < 2 || rows.length === 0) {
    return "Not enough history yet to compute month-over-month momentum — check back once a few more signals land.";
  }

  const accelerating = rows.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta);
  const declining = rows.filter((r) => r.delta < 0);
  const steady = rows.filter((r) => r.delta === 0 && r.series.some((v) => v > 0));
  const leader = [...rows].sort((a, b) => b.current - a.current)[0];
  const emerging = rows.filter((r) => r.series[0] === 0 && r.current > 0).sort((a, b) => b.current - a.current);

  const join = (list: MomentumRow[], withDelta: boolean) =>
    list.map((r) => (withDelta ? `${r.category} (${r.delta > 0 ? "+" : ""}${r.delta})` : r.category)).join(", ");

  const clauses: string[] = [];
  if (accelerating.length) clauses.push(`${join(accelerating, true)} ${accelerating.length === 1 ? "is" : "are"} accelerating this month`);
  if (declining.length) clauses.push(`${join(declining, true)} ${declining.length === 1 ? "is" : "are"} cooling off`);
  if (steady.length) clauses.push(`${join(steady, false)} ${steady.length === 1 ? "is" : "are"} holding flat`);

  let text = clauses.length ? clauses.join("; ") + ". " : "";
  text += `${leader.category} remains the largest theme by volume (${leader.current} this month).`;
  if (emerging.length) {
    const names = emerging.slice(0, 2).map((r) => r.category).join(" and ");
    text += ` ${names} had zero signals at the start of this window and ${emerging.slice(0, 2).length > 1 ? "are" : "is"} worth watching.`;
  }
  if (totalSignals < 20) {
    text += ` (Early days — only ${totalSignals} signals tracked so far, so month-over-month moves are still noisy.)`;
  }
  return text;
}

/** Auto-drafted executive-summary paragraph, ready to paste into a report. */
export function buildExecSummary(stories: Story[]): string {
  if (stories.length === 0) return "No signals tracked yet.";

  const sorted = [...stories].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const recent = sorted.slice(0, Math.min(3, sorted.length));
  const recentBold = recent.filter((s) => s.spicy).length;

  const counts = new Map<string, number>();
  stories.forEach((s) => counts.set(s.category, (counts.get(s.category) ?? 0) + 1));
  const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];

  const since = new Date(recent[recent.length - 1].publishedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const names = recent.map((s) => s.tool.name || s.title).join(", ");

  let text = `Since ${since}, ${recent.length} new signal${recent.length === 1 ? "" : "s"} landed — covering ${names}. `;
  if (recentBold > 0) {
    text += `${recentBold} of ${recent.length === 1 ? "that" : "those"} ${recentBold === 1 ? "is" : "are"} bold, contrarian call${recentBold === 1 ? "" : "s"} worth flagging on ${recentBold === 1 ? "its" : "their"} own. `;
  }
  if (top) {
    text += `${top[0]} remains the most-covered theme overall (${top[1]} of ${stories.length} signals to date), with ${stories.length} signals tracked across ${counts.size} themes.`;
  }
  return text;
}

export function topTools(stories: Story[], limit = 6): NamedCount[] {
  const counts = new Map<string, number>();
  for (const s of stories) {
    if (!s.tool?.name) continue;
    counts.set(s.tool.name, (counts.get(s.tool.name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
