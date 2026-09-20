import { MonthCount } from "@/lib/trend-data";

export default function VolumeTrendChart({ data }: { data: MonthCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
          <span className="text-xs font-semibold text-white tabular-nums">{d.count}</span>
          <div
            className="w-full max-w-10 rounded-t-lg bg-[#7F77DD] shadow-lg shadow-[#7F77DD]/20"
            style={{ height: `${Math.max(6, (d.count / max) * 100)}%` }}
            title={`${d.label}: ${d.count}`}
          />
          <span className="text-xs text-[var(--foreground)] opacity-50 whitespace-nowrap">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
