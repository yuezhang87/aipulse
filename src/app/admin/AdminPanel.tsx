"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { categoryColors } from "@/lib/category-colors";

interface PendingStory {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | string[] | null;
  author: string | null;
  category: string | null;
  tool: string | null;
  tool_url: string | null;
  source: string | null;
  source_url: string | null;
  score: number;
  spicy: boolean | null;
  status: string;
  created_at: string;
}

function getContentArr(raw: string | string[] | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function scoreStyle(score: number) {
  if (score >= 9) return "bg-green-500/15 text-green-400 border-green-500/20";
  if (score >= 7) return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-red-500/15 text-red-400 border-red-500/20";
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aipulse2026";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [stories, setStories] = useState<PendingStory[]>([]);
  const [fetching, setFetching] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", summary: "", content: "" });
  const [autoLoading, setAutoLoading] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStories = useCallback(async () => {
    setFetching(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("pending_stories")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setFetching(false);
    if (error || !data) {
      showToast("Failed to load stories", "err");
      return;
    }
    setStories(data as PendingStory[]);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
      fetchStories();
    }
  }, [fetchStories]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      localStorage.setItem("admin_authed", "true");
      setAuthed(true);
      fetchStories();
    } else {
      setPwError(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_authed");
    setAuthed(false);
    setStories([]);
  };

  const patch = useCallback(async (id: string, body: object) => {
    setActionLoading((prev) => new Set(prev).add(id));
    console.log('[admin] sending x-admin-password:', ADMIN_PASSWORD);
    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASSWORD,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      return true;
    } catch (e) {
      showToast(`Error: ${(e as Error).message}`, "err");
      return false;
    } finally {
      setActionLoading((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  }, []);

  const approve = async (id: string) => {
    if (await patch(id, { status: "approved" })) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast("Approved — live in feed");
    }
  };

  const reject = async (id: string) => {
    if (await patch(id, { status: "rejected" })) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast("Rejected");
    }
  };

  const startEdit = (story: PendingStory) => {
    const contentArr = getContentArr(story.content);
    setEditingId(story.id);
    setEditForm({
      title: story.title,
      summary: story.summary ?? "",
      content: contentArr.join("\n\n"),
    });
  };

  const saveEdit = async (id: string) => {
    const contentArr = editForm.content
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (
      await patch(id, {
        status: "approved",
        title: editForm.title,
        summary: editForm.summary,
        content: contentArr,
      })
    ) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      setEditingId(null);
      showToast("Edited and approved");
    }
  };

  const autoApprove = async () => {
    setAutoLoading(true);
    console.log('[admin] auto-approve sending x-admin-password:', ADMIN_PASSWORD);
    try {
      const res = await fetch("/api/admin/stories/auto-approve", {
        method: "POST",
        headers: { "x-admin-password": ADMIN_PASSWORD },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStories((prev) => prev.filter((s) => s.score < 8));
      showToast(`Auto-approved ${json.approved} stories — now live in feed`);
    } catch (e) {
      showToast(`Error: ${(e as Error).message}`, "err");
    } finally {
      setAutoLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return s;
    });
  };

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#7F77DD] flex items-center justify-center">
              <span className="text-white font-bold text-sm">ai</span>
            </div>
            <span className="text-white font-bold text-xl">aiPulse Admin</span>
          </div>
          <form
            onSubmit={login}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-4"
          >
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwError(false);
                }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30"
              />
              {pwError && (
                <p className="text-red-400 text-xs mt-1.5">Incorrect password</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold rounded-xl bg-[#7F77DD] hover:bg-[#9590e8] text-white transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin panel ────────────────────────────────────────────────────────────
  const pendingHighScore = stories.filter((s) => s.score >= 8).length;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl transition-all ${
            toast.type === "ok"
              ? "bg-green-500/20 border border-green-500/30 text-green-300"
              : "bg-red-500/20 border border-red-500/30 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-[#7F77DD] flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">ai</span>
              </div>
              <h1 className="text-xl font-bold text-white">Admin Review</h1>
            </div>
            <p className="text-sm text-white/40">
              {stories.length} pending {stories.length === 1 ? "story" : "stories"}
              {pendingHighScore > 0 && (
                <span className="ml-2 text-[#a29ce8]">
                  · {pendingHighScore} scored ≥ 8
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={autoApprove}
              disabled={autoLoading || pendingHighScore === 0}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#7F77DD] hover:bg-[#9590e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {autoLoading
                ? "Approving…"
                : `Auto-approve ≥ 8 (${pendingHighScore})`}
            </button>
            <a
              href="/"
              className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-xl transition-colors"
            >
              View site →
            </a>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {fetching && (
          <div className="text-center py-24 text-white/30">
            <p>Loading stories…</p>
          </div>
        )}

        {!fetching && stories.length === 0 && (
          <div className="text-center py-24 text-white/30 border border-white/5 rounded-2xl">
            <p className="text-lg font-medium">No pending stories</p>
            <p className="text-sm mt-1">Run the pipeline to get new stories</p>
          </div>
        )}

        <div className="space-y-4">
          {stories.map((story) => {
            const isEditing = editingId === story.id;
            const isLoading = actionLoading.has(story.id);
            const isExpanded = expandedIds.has(story.id);
            const catColor =
              categoryColors[story.category ?? ""] ??
              "bg-white/5 text-white/50 border-white/10";
            const contentArr = getContentArr(story.content);

            return (
              <div
                key={story.id}
                className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Left: story details */}
                    <div className="flex-1 min-w-0">
                      {/* Badge row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${catColor}`}
                        >
                          {story.category ?? "Uncategorized"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${scoreStyle(story.score)}`}
                        >
                          {story.score}/10
                        </span>
                        {story.spicy && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-orange-500/10 text-orange-400 border-orange-500/20 font-semibold">
                            🔮 Bold prediction
                          </span>
                        )}
                        {story.source_url ? (
                          <a
                            href={story.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white/30 hover:text-[#a29ce8] transition-colors"
                          >
                            {story.source ?? "Source"} ↗
                          </a>
                        ) : (
                          story.source && (
                            <span className="text-xs text-white/30">
                              {story.source}
                            </span>
                          )
                        )}
                        <span className="text-xs text-white/20">
                          {timeAgo(story.created_at)}
                        </span>
                      </div>

                      {/* Title */}
                      {isEditing ? (
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, title: e.target.value }))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30 mb-3"
                        />
                      ) : (
                        <h2 className="text-white font-semibold text-base leading-snug mb-2">
                          {story.title}
                        </h2>
                      )}

                      {/* Author + tool */}
                      {(story.author || story.tool) && (
                        <div className="flex items-center gap-3 text-xs text-white/30 mb-2.5">
                          {story.author && <span>by {story.author}</span>}
                          {story.tool && (
                            <span>
                              {story.tool_url ? (
                                <a
                                  href={story.tool_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#a29ce8]/60 hover:text-[#a29ce8] transition-colors"
                                >
                                  Tool: {story.tool} ↗
                                </a>
                              ) : (
                                <span className="text-[#a29ce8]/60">
                                  Tool: {story.tool}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Summary (view mode) */}
                      {!isEditing && story.summary && (
                        <p className="text-white/50 text-sm leading-relaxed">
                          {story.summary}
                        </p>
                      )}

                      {/* Edit fields */}
                      {isEditing && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5">
                              Summary
                            </label>
                            <textarea
                              value={editForm.summary}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  summary: e.target.value,
                                }))
                              }
                              rows={2}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5">
                              Content{" "}
                              <span className="normal-case font-normal text-white/20">
                                (blank line = new paragraph)
                              </span>
                            </label>
                            <textarea
                              value={editForm.content}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  content: e.target.value,
                                }))
                              }
                              rows={12}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30 resize-y font-mono leading-relaxed"
                            />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => saveEdit(story.id)}
                              disabled={isLoading}
                              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#7F77DD] hover:bg-[#9590e8] disabled:opacity-40 transition-colors"
                            >
                              {isLoading ? "Saving…" : "Save & Approve"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: action buttons */}
                    {!isEditing && (
                      <div className="flex flex-col gap-2 shrink-0 mt-0.5">
                        <button
                          onClick={() => approve(story.id)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 disabled:opacity-40 transition-colors whitespace-nowrap"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => startEdit(story)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#7F77DD]/10 text-[#a29ce8] border border-[#7F77DD]/20 hover:bg-[#7F77DD]/20 disabled:opacity-40 transition-colors whitespace-nowrap"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => reject(story.id)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 disabled:opacity-40 transition-colors whitespace-nowrap"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expandable content (view mode only) */}
                  {!isEditing && contentArr.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleExpand(story.id)}
                        className="text-xs text-white/25 hover:text-white/50 transition-colors"
                      >
                        {isExpanded
                          ? "▲ Hide content"
                          : `▼ Show content (${contentArr.length} paragraph${contentArr.length !== 1 ? "s" : ""})`}
                      </button>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                          {contentArr.map((para, i) => (
                            <p
                              key={i}
                              className="text-white/40 text-sm leading-relaxed"
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
