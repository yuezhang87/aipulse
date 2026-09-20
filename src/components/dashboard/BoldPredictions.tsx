import { Story } from "@/types/story";
import CopyButton from "./CopyButton";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BoldPredictions({ stories }: { stories: Story[] }) {
  const bold = stories.filter((s) => s.spicy);

  if (bold.length === 0) {
    return <p className="text-sm text-[var(--foreground)] opacity-40">No bold predictions flagged yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {bold.map((s) => {
        const citation = `"${s.summary}" — ${s.title}, ${s.source} (${fmtDate(s.publishedAt)}). ${s.sourceUrl}`;
        return (
          <div key={s.id} className="border border-[var(--border)] rounded-xl p-4 bg-white/[0.03]">
            <p className="text-sm text-[var(--foreground)] leading-relaxed mb-3">
              <span className="text-[#a29ce8] font-bold">&ldquo;</span>
              {s.summary}
              <span className="text-[#a29ce8] font-bold">&rdquo;</span>
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-[var(--foreground)] opacity-40">
                {s.category} ·{" "}
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:text-[#a29ce8] hover:opacity-100 transition-colors"
                >
                  {s.source}
                </a>{" "}
                · {fmtDate(s.publishedAt)} ·{" "}
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a29ce8] font-semibold hover:underline"
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
