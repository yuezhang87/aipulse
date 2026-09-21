import { NamedCount } from "@/lib/trend-data";

export default function RankedList({ data }: { data: NamedCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  if (data.length === 0) {
    return <p className="text-sm text-[#1a1a2e] opacity-40">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="text-xs font-black text-[#5B4FC7]/50 w-4 shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm text-[#1a1a2e] truncate" title={d.name}>{d.name}</span>
              <span className="text-xs font-semibold text-[#1a1a2e] opacity-60 tabular-nums shrink-0">
                {d.count}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#eeedf6] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B4FC7]"
                style={{ width: `${Math.max(4, (d.count / max) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
