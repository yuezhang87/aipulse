"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ok = await copyToClipboard(text);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }}
      className="text-xs px-2.5 py-1.5 rounded-lg border border-[#e4e3ef] text-[#1a1a2e] opacity-60 hover:opacity-100 hover:border-[#5B4FC7]/40 hover:text-[#5B4FC7] transition-all whitespace-nowrap font-medium"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
