import { MomentumRow } from "@/lib/trend-data";
import { categoryHexColors } from "@/lib/category-colors";

function sparkPath(values: number[], w: number, h: number) {
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = Math.max(1, max - min);
  const stepX = values.length > 1 ? w / (values.length - 1) : 0;
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return { d, last: pts[pts.length - 1] };
}

export default function MomentumGrid({ months, rows, digest }: { months: string[]; rows: MomentumRow[]; digest: string }) {
  return (
    <div>
      <p className="text-sm text-[#1a1a2e] opacity-70 leading-relaxed mb-5 max-w-3xl">{digest}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {rows.map((r) => {
          const color = categoryHexColors[r.category] ?? "#7F77DD";
          const spark = sparkPath(r.series, 100, 30);
          const deltaLabel = r.delta > 0 ? `+${r.delta}` : r.delta < 0 ? `−${Math.abs(r.delta)}` : "±0";
          const lastMonth = months.length > 1 ? months[months.length - 2] : "";
          return (
            <div key={r.category} className="border border-[#e4e3ef] rounded-xl p-3 bg-[#faf9fd]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-xs font-bold text-[#1a1a2e] leading-tight">{r.category}</span>
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-xl font-mono font-semibold text-[#1a1a2e]">{r.current}</span>
                <span className="text-[11px] font-mono text-[#1a1a2e] opacity-50">
                  {deltaLabel}{lastMonth ? ` vs ${lastMonth}` : ""}
                </span>
              </div>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-[26px] mt-2 overflow-visible">
                <path d={spark.d} fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                {spark.last && (
                  <circle cx={spark.last[0]} cy={spark.last[1]} r={3} fill={color} stroke="#faf9fd" strokeWidth={2} />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
