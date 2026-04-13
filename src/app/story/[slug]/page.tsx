import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FireButton from "@/components/FireButton";
import TldrSection from "@/components/TldrSection";
import { mockStories } from "@/lib/mock-stories";
import { categoryColors } from "@/lib/category-colors";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function generateStaticParams() {
  return mockStories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = mockStories.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <Navbar />

      {/* Hero */}
      <div
        className="relative overflow-hidden border-b border-[var(--border)]"
        style={{
          background:
            "linear-gradient(160deg, #0d0d1a 0%, #12121f 40%, #1a1a2e 100%)",
        }}
      >
        {/* Subtle radial glow behind headline */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(127,119,221,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-14">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground)] opacity-50 hover:opacity-90 hover:text-[#a29ce8] transition-all mb-8 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to feed
          </Link>

          {/* Category + time */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold tracking-wide ${categoryColors[story.category]}`}
            >
              {story.category}
            </span>
            {story.spicy && (
              <span title="Spicy take" className="text-base leading-none">🌶️</span>
            )}
            <span className="text-xs text-[var(--foreground)] opacity-40">
              {timeAgo(story.publishedAt)} · {story.readTime} min read
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
            {story.title}
          </h1>

          {/* Summary */}
          <p className="text-base text-[var(--foreground)] opacity-65 leading-relaxed mb-8 max-w-2xl">
            {story.summary}
          </p>

          {/* Meta row: source badge + fire */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/5">
              <div className="w-2 h-2 rounded-full bg-[#7F77DD] shrink-0" />
              <span className="text-sm font-medium text-white/80">
                {story.source}
              </span>
            </div>
            <FireButton initialCount={story.fireCount} />
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* TL;DR + Listen */}
        <TldrSection summary={story.summary} content={story.content} />

        {/* Narrative */}
        <article className="space-y-6 -mt-6">
          {story.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[17px] leading-[1.8] text-[var(--foreground)] opacity-85"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Inspired by */}
        <div className="rounded-2xl border border-[#7F77DD]/20 bg-[#7F77DD]/5 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">💡</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#a29ce8] uppercase tracking-widest mb-1">
                Inspired by
              </p>
              <p className="text-white font-semibold text-base mb-1 leading-snug">
                {story.source}
              </p>
              <p className="text-sm text-[var(--foreground)] opacity-55 mb-4">
                This story was discovered from the original post. All
                perspectives, results, and opinions belong to the original
                author.
              </p>
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a29ce8] hover:text-white transition-colors group"
              >
                Read original on {story.source}
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Tool review */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
            <span className="text-base">🛠</span>
            <span className="text-xs font-semibold text-[var(--foreground)] opacity-50 uppercase tracking-widest">
              Tool in this story
            </span>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-1">
                  {story.tool.name}
                </h3>
                <p className="text-sm text-[#a29ce8] font-medium mb-4">
                  {story.tool.job}
                </p>
                <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed">
                  {story.tool.review}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <a
                href={story.tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7F77DD] hover:bg-[#9590e8] text-white text-sm font-semibold transition-colors"
              >
                Visit {story.tool.name}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Back to feed link */}
        <div className="pt-4 border-t border-[var(--border)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] opacity-50 hover:opacity-100 hover:text-[#a29ce8] transition-all group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all stories
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-4">
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
