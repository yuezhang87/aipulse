import { NamedCount } from "@/lib/trend-data";
import { categoryHexColors } from "@/lib/category-colors";

const R = 52;
const CX = 65;
const CY = 65;
const STROKE = 18;
const GAP = 2.5;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function CategoryDonut({ data }: { data: NamedCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const ordered = [...data].sort((a, b) => b.count - a.count);

  let offset = 0;
  const segments = ordered
    .filter((d) => d.count > 0)
    .map((d) => {
      const frac = d.count / total;
      const segLen = frac * CIRCUMFERENCE;
      const dasharray = `${Math.max(0, segLen - GAP)} ${CIRCUMFERENCE - segLen + GAP}`;
      const dashoffset = -offset;
      offset += segLen;
      return { ...d, dasharray, dashoffset, pct: Math.round(frac * 100) };
    });

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative w-[150px] h-[150px] shrink-0">
        <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          {segments.map((s) => (
            <circle
              key={s.name}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={categoryHexColors[s.name] ?? "#7F77DD"}
              strokeWidth={STROKE}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
            >
              <title>{`${s.name}: ${s.count} (${s.pct}%)`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white">{total}</span>
          <span className="text-[11px] text-[var(--foreground)] opacity-40">signals</span>
        </div>
      </div>
      <div className="flex-1 min-w-[180px] flex flex-col gap-2">
        {ordered.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: categoryHexColors[d.name] ?? "#7F77DD" }}
            />
            <span className="flex-1 text-[var(--foreground)] opacity-70 truncate">{d.name}</span>
            <span className="font-semibold text-white tabular-nums">{d.count}</span>
            <span className="text-[var(--foreground)] opacity-40 tabular-nums w-8 text-right">
              {total > 0 ? Math.round((d.count / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
