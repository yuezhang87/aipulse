import Navbar from "@/components/Navbar";
import StoriesFeed from "@/components/StoriesFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import { getApprovedStories } from "@/lib/db-stories";
import { mockStories } from "@/lib/mock-stories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbStories = await getApprovedStories();
  const seenSlugs = new Set<string>();
  const stories = [...dbStories, ...mockStories]
    .filter((s) => {
      if (seenSlugs.has(s.slug)) return false;
      seenSlugs.add(s.slug);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#12121f] to-navy border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/10 text-[#a29ce8] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD] animate-pulse inline-block" />
              Signals on the future of mobile notifications & agents
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
              Where AI agents are taking your notifications —{" "}
              <span className="text-[#7F77DD]">before it happens.</span>
            </h1>
            <p className="text-base text-[var(--foreground)] opacity-60 leading-relaxed">
              Tracking product launches, platform shifts, and forward-looking bets
              from across the industry — a macro view of how notifications evolve
              as agents take on more of your daily tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Feed */}
          <main className="flex-1 min-w-0">
            <StoriesFeed stories={stories} />
          </main>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <TrendingSidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground)] opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#7F77DD] flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">ai</span>
            </div>
            <span>aiPulse &copy; 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-80 transition-opacity">About</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-80 transition-opacity">RSS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
