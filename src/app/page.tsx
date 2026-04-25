import Navbar from "@/components/Navbar";
import StoriesFeed from "@/components/StoriesFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import { getApprovedStories } from "@/lib/db-stories";
import { mockStories } from "@/lib/mock-stories";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbStories = await getApprovedStories();
  const stories = dbStories.length > 0 ? dbStories : mockStories;
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#12121f] to-navy border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/10 text-[#a29ce8] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F77DD] animate-pulse inline-block" />
              Real stories from real people using AI
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
              Discover how people use AI —{" "}
              <span className="text-[#7F77DD]">one story at a time.</span>
            </h1>
            <p className="text-base text-[var(--foreground)] opacity-60 leading-relaxed">
              Real stories from designers, nurses, developers, writers, and more
              — sharing how AI is changing how they actually work.
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
