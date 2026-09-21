"use client";

import { useState } from "react";
import Link from "next/link";
import { Story } from "@/types/story";
import { categoryHexColors } from "@/lib/category-colors";
import CopyButton from "./CopyButton";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentSignals({ stories }: { stories: Story[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = [...stories].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div>
      {sorted.map((s) => {
        const isOpen = openId === s.id;
        const citation = `${s.title} — ${s.source} (${fmtDate(s.publishedAt)}). ${s.sourceUrl}`;
        return (
          <div key={s.id} className="border-b border-[var(--border)] last:border-0 py-3">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setOpenId(isOpen ? null : s.id)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: categoryHexColors[s.category] ?? "#7F77DD" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">
                  <span
                    className={`inline-block text-[var(--foreground)] opacity-30 mr-1 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  >
                    ›
                  </span>
                  {s.title}
                  {s.spicy && <span className="ml-1.5 text-xs font-bold text-[#a29ce8]">◆ bold</span>}
                </p>
                <p className="text-xs text-[var(--foreground)] opacity-40 mt-0.5">
                  {s.category} · {s.tool.name}
                </p>
              </div>
              <span className="text-xs text-[var(--foreground)] opacity-50 hidden sm:inline shrink-0">
                {s.source}
              </span>
              <span className="text-xs font-mono text-[var(--foreground)] opacity-30 shrink-0">
                {fmtDate(s.publishedAt)}
              </span>
            </div>
            {isOpen && (
              <div className="mt-2 ml-[22px] pr-2">
                <p className="text-xs text-[var(--foreground)] opacity-60 leading-relaxed mb-2 max-w-2xl">
                  {s.summary}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href={`/story/${s.slug}`} className="text-xs text-[#a29ce8] hover:underline font-medium">
                    Read full story →
                  </Link>
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--foreground)] opacity-50 hover:opacity-100"
                  >
                    Original source ↗
                  </a>
                  <CopyButton text={citation} label="Copy cite" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
