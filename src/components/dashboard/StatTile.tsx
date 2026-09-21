interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatTile({ label, value, hint }: Props) {
  return (
    <div className="bg-white border border-[#e4e3ef] rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-semibold text-[#1a1a2e] opacity-50 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-[#1a1a2e] tabular-nums">{value}</p>
      {hint && (
        <p className="text-xs text-[#1a1a2e] opacity-40 mt-1">{hint}</p>
      )}
    </div>
  );
}
