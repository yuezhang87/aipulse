"use client";

interface Props {
  categories: readonly string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 text-sm px-4 py-1.5 rounded-full font-medium border transition-all duration-200 ${
            active === cat
              ? "bg-[#7F77DD] border-[#7F77DD] text-white shadow-lg shadow-[#7F77DD]/25"
              : "bg-transparent border-[var(--border)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:border-[#7F77DD]/50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
