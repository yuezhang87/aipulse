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
    <div className="bg-gradient-to-br from-[#5B4FC7]/[0.06] to-white bg-white border border-[#e4e3ef] rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-sm font-bold text-[#1a1a2e]">Latest digest — auto-drafted</h2>
        <span className="text-[11px] font-semibold text-[#5B4FC7] bg-[#5B4FC7]/10 rounded-md px-2 py-0.5 whitespace-nowrap">
          → Executive summary
        </span>
      </div>
      <p className="text-xs text-[#1a1a2e] opacity-40 mb-4">
        Rebuilds itself from what&apos;s currently tracked. Meant to be pasted straight into a status update or report intro.
      </p>
      <p className="text-sm text-[#1a1a2e] opacity-80 leading-relaxed mb-4 max-w-3xl">{summary}</p>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={summary} label="Copy summary" />
        <CopyButton text={allCitations} label="Copy all citations (.txt)" />
      </div>
    </div>
  );
}
