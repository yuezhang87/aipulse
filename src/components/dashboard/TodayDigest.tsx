"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Story } from "@/types/story";
import { categoryHexColors, CATEGORY_ORDER } from "@/lib/category-colors";
import CopyButton from "./CopyButton";

const READ_KEY = "aipulse:read-slugs";
const DAY_MS = 24 * 60 * 60 * 1000;

/** Falls back to a rough fireCount-based estimate for stories the pipeline didn't score. */
function importanceOf(s: Story): number {
  if (typeof s.score === "number") return s.score;
  return Math.min(10, Math.max(1, Math.round(s.fireCount / 30)));
}

function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function loadReadSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadSlugs(slugs: Set<string>) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(Array.from(slugs)));
  } catch {
    // localStorage unavailable (private mode, etc.) — read state just won't persist
  }
}

type SortMode = "importance" | "recent";
const FILTERS = ["All", ...CATEGORY_ORDER] as const;

/**
 * Preloads the image itself (rather than relying on the rendered <img>'s onError) so a
 * broken URL falls back to the cover placeholder reliably — an SSR'd <img> can finish
 * failing before hydration attaches its listener, silently losing the error event.
 */
function CardImage({ story, isRead, rank }: { story: Story; isRead: boolean; rank: number }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!story.imageUrl) return;
    setFailed(false);
    const probe = new window.Image();
    probe.onerror = () => setFailed(true);
    probe.src = story.imageUrl;
  }, [story.imageUrl]);

  const color = categoryHexColors[story.category] ?? "#5B4FC7";
  const showImage = Boolean(story.imageUrl) && !failed;

  return (
    <div
      className="relative w-full aspect-video overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.imageUrl}
          alt=""
          className={`w-full h-full object-cover ${isRead ? "grayscale opacity-60" : ""}`}
        />
      ) : (
        <span className="text-4xl font-extrabold" style={{ color: isRead ? `${color}55` : color }}>
          {story.title.charAt(0)}
        </span>
      )}
      <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/55 text-white backdrop-blur-sm">
        #{rank}
      </span>
      {!isRead && (
        <span
          className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-white/80"
          style={{ background: color }}
          title="Unread"
        />
      )}
    </div>
  );
}

export default function TodayDigest({ stories }: { stories: Story[] }) {
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const [sortMode, setSortMode] = useState<SortMode>("importance");

  useEffect(() => {
    setReadSlugs(loadReadSlugs());
    setMounted(true);
  }, []);

  const markRead = (slug: string) => {
    setReadSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev).add(slug);
      saveReadSlugs(next);
      return next;
    });
  };

  const toggleRead = (slug: string) => {
    setReadSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      saveReadSlugs(next);
      return next;
    });
  };

  const markAllRead = () => {
    const next = new Set(stories.map((s) => s.slug));
    setReadSlugs(next);
    saveReadSlugs(next);
  };

  const unreadCount = mounted ? stories.filter((s) => !readSlugs.has(s.slug)).length : stories.length;
  const readCount = stories.length - unreadCount;
  const recentCount = stories.filter((s) => Date.now() - new Date(s.publishedAt).getTime() < 7 * DAY_MS).length;
  const boldCount = stories.filter((s) => s.spicy).length;
  const progressPct = stories.length ? Math.round((readCount / stories.length) * 100) : 0;

  const overview =
    stories.length === 0
      ? "No tracked signals yet."
      : `${stories.length} signal${stories.length === 1 ? "" : "s"} tracked, ${unreadCount} unread` +
        (recentCount ? `, ${recentCount} from the last 7 days` : "") +
        (boldCount ? `, ${boldCount} bold prediction${boldCount === 1 ? "" : "s"}` : "") +
        ".";

  const filtered = useMemo(() => {
    const byCategory = category === "All" ? stories : stories.filter((s) => s.category === category);
    return [...byCategory].sort((a, b) =>
      sortMode === "recent"
        ? new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        : importanceOf(b) - importanceOf(a)
    );
  }, [stories, category, sortMode]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <p className="text-xs text-[#1a1a2e] opacity-60 max-w-lg">{overview}</p>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-[#5B4FC7] hover:underline shrink-0"
        >
          Mark all as read
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-[#eeedf6] overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-[#5B4FC7] transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors ${
                category === c
                  ? "bg-[#5B4FC7] text-white border-[#5B4FC7]"
                  : "bg-white text-[#1a1a2e] opacity-60 border-[#e4e3ef] hover:opacity-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs">
          <button
            onClick={() => setSortMode("importance")}
            className={`px-2.5 py-1 rounded-full border whitespace-nowrap ${
              sortMode === "importance"
                ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                : "text-[#1a1a2e] opacity-50 border-[#e4e3ef]"
            }`}
          >
            Most important
          </button>
          <button
            onClick={() => setSortMode("recent")}
            className={`px-2.5 py-1 rounded-full border whitespace-nowrap ${
              sortMode === "recent"
                ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                : "text-[#1a1a2e] opacity-50 border-[#e4e3ef]"
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[#1a1a2e] opacity-40 py-6 text-center">
          No signals in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const isRead = mounted && readSlugs.has(s.slug);
            const citation = `${s.title} — ${s.source} (${relativeTime(s.publishedAt)}). ${s.sourceUrl}`;
            return (
              <div
                key={s.id}
                className={`rounded-2xl border overflow-hidden transition-shadow flex flex-col ${
                  isRead ? "bg-[#faf9fd] border-[#e4e3ef]" : "bg-white border-[#e4e3ef] shadow-sm hover:shadow-md"
                }`}
              >
                <Link href={`/story/${s.slug}`} onClick={() => markRead(s.slug)}>
                  <CardImage story={s} isRead={isRead} rank={i + 1} />
                </Link>

                <div className="p-3.5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ background: isRead ? "#c9c6de" : categoryHexColors[s.category] ?? "#5B4FC7" }}
                    >
                      {s.source.charAt(0)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1a1a2e] opacity-60 truncate">
                      {s.source}
                    </span>
                    <span className="text-[10px] text-[#1a1a2e] opacity-35 ml-auto shrink-0">
                      {relativeTime(s.publishedAt)}
                    </span>
                  </div>

                  <Link
                    href={`/story/${s.slug}`}
                    onClick={() => markRead(s.slug)}
                    className={`text-sm font-semibold leading-snug line-clamp-2 hover:text-[#5B4FC7] ${
                      isRead ? "text-[#1a1a2e] opacity-50" : "text-[#1a1a2e]"
                    }`}
                  >
                    {s.title}
                    {s.spicy && <span className="ml-1.5 text-xs font-bold text-[#5B4FC7]">◆</span>}
                  </Link>

                  <p
                    className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                      isRead ? "text-[#1a1a2e] opacity-30" : "text-[#1a1a2e] opacity-60"
                    }`}
                  >
                    {s.summary}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#e4e3ef] text-[#1a1a2e] opacity-60">
                      {s.category}
                    </span>
                    {s.tool?.name && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#e4e3ef] text-[#1a1a2e] opacity-60 truncate max-w-[10rem]">
                        {s.tool.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mt-auto pt-2.5 flex-wrap">
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#1a1a2e] opacity-50 hover:opacity-100"
                    >
                      Original ↗
                    </a>
                    <CopyButton text={citation} label="Copy cite" />
                    <button
                      onClick={() => toggleRead(s.slug)}
                      className="text-[11px] text-[#5B4FC7] hover:underline ml-auto"
                    >
                      {isRead ? "Mark unread" : "Mark read"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
