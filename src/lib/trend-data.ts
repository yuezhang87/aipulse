import { Story } from "@/types/story";

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
