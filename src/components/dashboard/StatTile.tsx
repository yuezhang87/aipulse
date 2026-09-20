interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatTile({ label, value, hint }: Props) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5">
      <p className="text-xs font-semibold text-[var(--foreground)] opacity-50 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-white tabular-nums">{value}</p>
      {hint && (
        <p className="text-xs text-[var(--foreground)] opacity-40 mt-1">{hint}</p>
      )}
    </div>
  );
}
