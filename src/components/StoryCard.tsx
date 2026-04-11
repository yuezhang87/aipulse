"use client";

import { useState } from "react";
import { Story } from "@/types/story";

const categoryColors: Record<string, string> = {
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Research: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Finance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Health: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  Coding: "bg-[#7F77DD]/10 text-[#a29ce8] border-[#7F77DD]/20",
  Writing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  story: Story;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: Props) {
  const [fires, setFires] = useState(story.fireCount);
  const [fired, setFired] = useState(false);

  function handleFire(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (fired) {
      setFires((n) => n - 1);
    } else {
      setFires((n) => n + 1);
    }
    setFired((f) => !f);
  }

  if (featured) {
    return (
      <a
        href={story.sourceUrl}
        className="group block bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#7F77DD]/50 hover:shadow-xl hover:shadow-[#7F77DD]/5 transition-all duration-300"
      >
        {/* Top row: category + time */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${categoryColors[story.category]}`}
          >
            {story.category}
          </span>
          <span className="text-xs text-[var(--foreground)] opacity-40 shrink-0">
            {timeAgo(story.publishedAt)}
          </span>
        </div>

        {/* Title + thumbnail */}
        <div className="flex gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white group-hover:text-[#a29ce8] transition-colors leading-snug">
              {story.title}
            </h2>
          </div>
          {story.imageUrl && (
            <img
              src={story.imageUrl}
              alt=""
              width={84}
              height={84}
              className="rounded-xl object-cover shrink-0 w-[84px] h-[84px]"
            />
          )}
        </div>

        <p className="text-sm text-[var(--foreground)] opacity-60 leading-relaxed mb-4 line-clamp-3">
          {story.summary}
        </p>

        {/* Bottom row: source + read time + fire */}
        <div className="flex items-center justify-between text-xs text-[var(--foreground)] opacity-50">
          <div className="flex items-center gap-3">
            <span className="font-medium">{story.source}</span>
            <span>·</span>
            <span>{story.readTime} min read</span>
          </div>
          <button
            onClick={handleFire}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-150 ${
              fired
                ? "border-orange-500/40 bg-orange-500/10 text-orange-400 opacity-100"
                : "border-[var(--border)] hover:border-orange-500/30 hover:text-orange-400 hover:opacity-100"
            }`}
          >
            <span className="text-sm leading-none">🔥</span>
            <span className="font-semibold tabular-nums">{fires}</span>
          </button>
        </div>
      </a>
    );
  }

  return (
    <a
      href={story.sourceUrl}
      className="group flex gap-4 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-bg)] -mx-4 px-4 rounded-xl transition-all duration-200"
    >
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[story.category]}`}
          >
            {story.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white group-hover:text-[#a29ce8] transition-colors leading-snug mb-1.5 line-clamp-2">
          {story.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[var(--foreground)] opacity-40">
          <span>{story.source}</span>
          <span>·</span>
          <span>{timeAgo(story.publishedAt)}</span>
          <span>·</span>
          <span>{story.readTime} min</span>
        </div>
      </div>

      {/* Right side: thumbnail + fire */}
      <div className="flex flex-col items-end justify-between shrink-0 gap-2">
        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt=""
            width={84}
            height={84}
            className="rounded-xl object-cover w-[84px] h-[84px]"
          />
        )}
        <button
          onClick={handleFire}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-all duration-150 ${
            fired
              ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
              : "border-[var(--border)] text-[var(--foreground)] opacity-50 hover:border-orange-500/30 hover:text-orange-400 hover:opacity-100"
          }`}
        >
          <span className="text-sm leading-none">🔥</span>
          <span className="font-semibold tabular-nums">{fires}</span>
        </button>
      </div>
    </a>
  );
}
