"use client";

import { useState } from "react";

interface Props {
  initialCount: number;
}

export default function FireButton({ initialCount }: Props) {
  const [fires, setFires] = useState(initialCount);
  const [fired, setFired] = useState(false);

  function handleFire() {
    setFires((n) => (fired ? n - 1 : n + 1));
    setFired((f) => !f);
  }

  return (
    <button
      onClick={handleFire}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-150 ${
        fired
          ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
          : "border-[var(--border)] bg-white/5 text-[var(--foreground)] opacity-50 hover:border-orange-500/30 hover:text-orange-400 hover:opacity-100"
      }`}
    >
      <span className="text-base leading-none">🔥</span>
      <span className="text-sm font-semibold tabular-nums">{fires}</span>
    </button>
  );
}
