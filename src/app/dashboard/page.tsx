import Navbar from "@/components/Navbar";
import StatTile from "@/components/dashboard/StatTile";
import CategoryBarChart from "@/components/dashboard/CategoryBarChart";
import VolumeTrendChart from "@/components/dashboard/VolumeTrendChart";
import RankedList from "@/components/dashboard/RankedList";
import { getApprovedStories } from "@/lib/db-stories";
import { mockStories } from "@/lib/mock-stories";
import { countByCategory, countByMonth, countBySource, topTools } from "@/lib/trend-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dbStories = await getApprovedStories();
  const seenSlugs = new Set<string>();
  const stories = [...dbStories, ...mockStories].filter((s) => {
    if (seenSlugs.has(s.slug)) return false;
    seenSlugs.add(s.slug);
    return true;
  });

  const categoryCounts = countByCategory(stories);
  const monthCounts = countByMonth(stories);
  const sourceCounts = countBySource(stories);
  const toolCounts = topTools(stories);
  const boldPredictions = stories.filter((s) => s.spicy).length;
  const distinctSources = sourceCounts.length;

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      <div className="bg-gradient-to-b from-[#12121f] to-navy border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/10 text-[#a29ce8] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD] animate-pulse inline-block" />
              Macro view, updated as new signals land
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
              Where mobile notifications are{" "}
              <span className="text-[#7F77DD]">heading next.</span>
            </h1>
            <p className="text-base text-[var(--foreground)] opacity-60 leading-relaxed">
              A rollup of every tracked signal — by theme, by month, by source —
              for spotting momentum before it becomes obvious.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTile label="Tracked signals" value={stories.length} />
          <StatTile label="Themes active" value={categoryCounts.length} hint="out of 7 tracked" />
          <StatTile label="Bold predictions" value={boldPredictions} hint="contrarian or non-obvious calls" />
          <StatTile label="Sources monitored" value={distinctSources} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category distribution */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-1">Signal by theme</h2>
            <p className="text-xs text-[var(--foreground)] opacity-40 mb-5">
              Which part of the notification/agent story is getting the most coverage
            </p>
            <CategoryBarChart data={categoryCounts} />
          </div>

          {/* Volume trend */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-1">Signal volume over time</h2>
            <p className="text-xs text-[var(--foreground)] opacity-40 mb-5">
              Tracked signals per month — a rising line means the topic is heating up
            </p>
            <VolumeTrendChart data={monthCounts} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top sources */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-1">Top sources</h2>
            <p className="text-xs text-[var(--foreground)] opacity-40 mb-5">
              Outlets contributing the most tracked signals
            </p>
            <RankedList data={sourceCounts} />
          </div>

          {/* Top tools/platforms mentioned */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-1">Most-mentioned products & platforms</h2>
            <p className="text-xs text-[var(--foreground)] opacity-40 mb-5">
              What&apos;s actually shipping the features driving this trend
            </p>
            <RankedList data={toolCounts} />
          </div>
        </div>
      </div>

      <footer className="border-t border-[var(--border)] mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground)] opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#7F77DD] flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">ai</span>
            </div>
            <span>aiPulse &copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
