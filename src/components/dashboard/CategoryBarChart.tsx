import { NamedCount } from "@/lib/trend-data";
import { categoryBarColors } from "@/lib/category-colors";

export default function CategoryBarChart({ data }: { data: NamedCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="text-xs text-[var(--foreground)] opacity-70 w-40 shrink-0 truncate" title={d.name}>
            {d.name}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${categoryBarColors[d.name] ?? "bg-white/30"}`}
              style={{ width: `${Math.max(4, (d.count / max) * 100)}%` }}
              title={`${d.name}: ${d.count}`}
            />
          </div>
          <span className="text-xs font-semibold text-white tabular-nums w-6 text-right shrink-0">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}
