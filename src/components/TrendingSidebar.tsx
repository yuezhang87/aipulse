import { mockStories } from "@/lib/mock-stories";

export default function TrendingSidebar() {
  const hotStories = [...mockStories]
    .sort((a, b) => b.fireCount - a.fireCount)
    .slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Hot stories by fire count */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          🔥 Most Fired
        </h3>
        <div className="space-y-4">
          {hotStories.map((story, i) => (
            <a
              key={story.id}
              href={story.sourceUrl}
              className="group flex gap-3 items-start hover:opacity-100 opacity-80 transition-opacity"
            >
              <span className="text-2xl font-black text-[#7F77DD]/30 leading-none mt-0.5 w-6 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-[#a29ce8] transition-colors leading-snug line-clamp-2">
                  {story.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-[var(--foreground)] opacity-40">
                    {story.source}
                  </p>
                  <span className="text-xs text-orange-400 font-medium">
                    🔥 {story.fireCount}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-[#7F77DD]/20 to-[#1a1a2e] border border-[#7F77DD]/30 rounded-2xl p-5">
        <div className="w-8 h-8 rounded-lg bg-[#7F77DD] flex items-center justify-center mb-3 shadow-lg shadow-[#7F77DD]/30">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Daily AI Digest</h3>
        <p className="text-xs text-[var(--foreground)] opacity-60 mb-4 leading-relaxed">
          Get the hottest AI stories delivered to your inbox every morning.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] placeholder:opacity-40 focus:outline-none focus:border-[#7F77DD]/60 transition-all"
          />
          <button className="w-full text-xs px-4 py-2 rounded-lg bg-[#7F77DD] text-white font-medium hover:bg-[#a29ce8] transition-colors shadow-md shadow-[#7F77DD]/20">
            Subscribe free
          </button>
        </div>
      </div>

      {/* Topics */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {["Productivity", "Prompting", "Claude", "ChatGPT", "Copilot", "No-code", "Figma AI", "Perplexity"].map((tag) => (
            <button
              key={tag}
              className="text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:border-[#7F77DD]/50 hover:text-[#a29ce8] transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
