"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  storyId: string;
  initialCount: number;
}

function getUserId(): string {
  let id = localStorage.getItem("aipulse_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("aipulse_user_id", id);
  }
  return id;
}

export default function FireButton({ storyId, initialCount }: Props) {
  const [fires, setFires] = useState(initialCount);
  const [fired, setFired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();

    async function init() {
      try {
        const [countResult, firedResult] = await Promise.all([
          supabase
            .from("story_fires")
            .select("fire_count")
            .eq("story_id", storyId)
            .single(),
          supabase
            .from("user_fires")
            .select("story_id")
            .eq("user_id", userId)
            .eq("story_id", storyId)
            .single(),
        ]);

        if (countResult.data) {
          setFires(countResult.data.fire_count);
        }
        setFired(!!firedResult.data);
      } catch {
        // Fall back to initialCount already set in state
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [storyId]);

  async function handleFire() {
    const userId = getUserId();
    const nowFired = !fired;

    // Optimistic update
    setFired(nowFired);
    setFires((n) => (nowFired ? n + 1 : n - 1));

    try {
      if (nowFired) {
        await Promise.all([
          supabase.from("user_fires").insert({ user_id: userId, story_id: storyId }),
          supabase.rpc("increment_fire_count", { p_story_id: storyId, p_initial: initialCount }),
        ]);
      } else {
        await Promise.all([
          supabase
            .from("user_fires")
            .delete()
            .eq("user_id", userId)
            .eq("story_id", storyId),
          supabase.rpc("decrement_fire_count", { p_story_id: storyId }),
        ]);
      }
    } catch {
      // Revert optimistic update on failure
      setFired(!nowFired);
      setFires((n) => (nowFired ? n - 1 : n + 1));
    }
  }

  return (
    <button
      onClick={handleFire}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-150 ${
        fired
          ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
          : "border-[var(--border)] bg-white/5 text-[var(--foreground)] opacity-50 hover:border-orange-500/30 hover:text-orange-400 hover:opacity-100"
      }`}
    >
      <span className="text-base leading-none">🔥</span>
      <span className="text-sm font-semibold tabular-nums">{fires}</span>
    </button>
  );
}
