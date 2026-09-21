import { Story } from "@/types/story";
import CopyButton from "./CopyButton";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ReportDigest({ summary, stories }: { summary: string; stories: Story[] }) {
  const sorted = [...stories].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const allCitations = sorted
    .map((s) => `- ${s.title} — ${s.source} (${fmtDate(s.publishedAt)}). ${s.sourceUrl}`)
    .join("\n");

  return (
    <div className="bg-gradient-to-br from-[#7F77DD]/10 to-transparent bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-sm font-bold text-white">Latest digest — auto-drafted</h2>
        <span className="text-[11px] font-semibold text-[#a29ce8] bg-[#7F77DD]/10 rounded-md px-2 py-0.5 whitespace-nowrap">
          → Executive summary
        </span>
      </div>
      <p className="text-xs text-[var(--foreground)] opacity-40 mb-4">
        Rebuilds itself from what&apos;s currently tracked. Meant to be pasted straight into a status update or report intro.
      </p>
      <p className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed mb-4 max-w-3xl">{summary}</p>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={summary} label="Copy summary" />
        <CopyButton text={allCitations} label="Copy all citations (.txt)" />
      </div>
    </div>
  );
}
