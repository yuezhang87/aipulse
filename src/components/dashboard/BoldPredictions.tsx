import { Story } from "@/types/story";
import CopyButton from "./CopyButton";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BoldPredictions({ stories }: { stories: Story[] }) {
  const bold = stories.filter((s) => s.spicy);

  if (bold.length === 0) {
    return <p className="text-sm text-[#1a1a2e] opacity-40">No bold predictions flagged yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {bold.map((s) => {
        const citation = `"${s.summary}" — ${s.title}, ${s.source} (${fmtDate(s.publishedAt)}). ${s.sourceUrl}`;
        return (
          <div key={s.id} className="border border-[#e4e3ef] rounded-xl p-4 bg-[#faf9fd]">
            <p className="text-sm text-[#1a1a2e] leading-relaxed mb-3">
              <span className="text-[#5B4FC7] font-bold">&ldquo;</span>
              {s.summary}
              <span className="text-[#5B4FC7] font-bold">&rdquo;</span>
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-[#1a1a2e] opacity-50">
                {s.category} ·{" "}
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:text-[#5B4FC7] hover:opacity-100 transition-colors"
                >
                  {s.source}
                </a>{" "}
                · {fmtDate(s.publishedAt)} ·{" "}
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5B4FC7] font-semibold hover:underline"
                >
                  Read source ↗
                </a>
              </p>
              <CopyButton text={citation} label="Copy citation" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
