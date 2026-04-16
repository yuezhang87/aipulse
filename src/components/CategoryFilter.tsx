"use client";

const categoryEmojis: Record<string, string> = {
  Business: "💼",
};

interface Props {
  categories: readonly string[];
  active: string;
  onChange: (cat: string) => void;
  spicyOnly: boolean;
  onSpicyToggle: () => void;
}

export default function CategoryFilter({ categories, active, onChange, spicyOnly, onSpicyToggle }: Props) {
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
          {categoryEmojis[cat] ? `${categoryEmojis[cat]} ${cat}` : cat}
        </button>
      ))}

      {/* Spicy filter — warm red/amber tint to distinguish from category pills */}
      <button
        onClick={onSpicyToggle}
        className={`shrink-0 text-sm px-4 py-1.5 rounded-full font-medium border transition-all duration-200 ${
          spicyOnly
            ? "bg-orange-500/80 border-orange-500 text-white shadow-lg shadow-orange-500/25"
            : "bg-transparent border-[var(--border)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:border-orange-500/50 hover:text-orange-300"
        }`}
      >
        🌶️ Spicy
      </button>
    </div>
  );
}
