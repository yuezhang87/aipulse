"use client";

import { useState, useCallback } from "react";
import { categoryColors } from "@/lib/category-colors";

export interface PendingStory {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  score: number;
  source: string;
  created_at: string;
  status: string;
}

interface AdminPanelProps {
  initialStories: PendingStory[];
  adminSecret: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminPanel({ initialStories, adminSecret }: AdminPanelProps) {
  const [stories, setStories] = useState<PendingStory[]>(initialStories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", summary: "" });
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const patch = useCallback(
    async (id: string, body: object) => {
      setLoading((prev) => new Set(prev).add(id));
      try {
        const res = await fetch(`/api/admin/stories/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": adminSecret,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
        return true;
      } catch (e) {
        showToast(`Error: ${(e as Error).message}`, "err");
        return false;
      } finally {
        setLoading((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    },
    [adminSecret]
  );

  const approve = async (id: string) => {
    if (await patch(id, { status: "approved" })) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast("Approved and live in feed");
    }
  };

  const reject = async (id: string) => {
    if (await patch(id, { status: "rejected" })) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast("Rejected");
    }
  };

  const startEdit = (story: PendingStory) => {
    setEditingId(story.id);
    setEditForm({ title: story.title, summary: story.summary ?? "" });
  };

  const saveEdit = async (id: string) => {
    if (await patch(id, { status: "approved", title: editForm.title, summary: editForm.summary })) {
      setStories((prev) => prev.filter((s) => s.id !== id));
      setEditingId(null);
      showToast("Edited and approved");
    }
  };

  const autoApprove = async () => {
    setAutoLoading(true);
    try {
      const res = await fetch("/api/admin/stories/auto-approve", {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
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

  const pendingHighScore = stories.filter((s) => s.score >= 8).length;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Toast */}
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
                <span className="ml-2 text-[#a29ce8]">· {pendingHighScore} scored ≥ 8</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={autoApprove}
              disabled={autoLoading || pendingHighScore === 0}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#7F77DD] hover:bg-[#9590e8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {autoLoading ? "Approving…" : `Auto-approve score ≥ 8 (${pendingHighScore})`}
            </button>
            <a
              href="/"
              className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 rounded-xl transition-colors"
            >
              View site →
            </a>
          </div>
        </div>

        {stories.length === 0 && (
          <div className="text-center py-24 text-white/30 border border-white/5 rounded-2xl">
            <p className="text-lg font-medium">No pending stories</p>
            <p className="text-sm mt-1">Run the pipeline to get new stories</p>
          </div>
        )}

        <div className="space-y-3">
          {stories.map((story) => {
            const isEditing = editingId === story.id;
            const isLoading = loading.has(story.id);
            const catColor =
              categoryColors[story.category] ?? "bg-white/5 text-white/50 border-white/10";

            return (
              <div
                key={story.id}
                className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${catColor}`}
                        >
                          {story.category}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                            story.score >= 8
                              ? "bg-[#7F77DD]/15 text-[#a29ce8] border-[#7F77DD]/20"
                              : "bg-white/5 text-white/40 border-white/10"
                          }`}
                        >
                          {story.score}/10
                        </span>
                        <span className="text-xs text-white/30">
                          {story.source} · {timeAgo(story.created_at)}
                        </span>
                      </div>
                      <p className="text-white font-semibold leading-snug">{story.title}</p>
                      {story.summary && !isEditing && (
                        <p className="text-white/40 text-sm mt-1.5 leading-relaxed line-clamp-2">
                          {story.summary}
                        </p>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <button
                          onClick={() => approve(story.id)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 disabled:opacity-40 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(story.id)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 disabled:opacity-40 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => startEdit(story)}
                          disabled={isLoading}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 disabled:opacity-40 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-3 pt-4 border-t border-white/5">
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-widest font-semibold mb-1.5">
                          Title
                        </label>
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, title: e.target.value }))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-widest font-semibold mb-1.5">
                          Summary
                        </label>
                        <textarea
                          value={editForm.summary}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, summary: e.target.value }))
                          }
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7F77DD]/60 focus:ring-1 focus:ring-[#7F77DD]/30 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
