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

async function incrementFireCount(storyId: string, initialCount: number) {
  const { data: existing } = await supabase
    .from("story_fires")
    .select("fire_count")
    .eq("story_id", storyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("story_fires")
      .update({ fire_count: existing.fire_count + 1 })
      .eq("story_id", storyId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("story_fires")
      .insert({ story_id: storyId, fire_count: initialCount + 1 });
    if (error) throw error;
  }
}

async function decrementFireCount(storyId: string) {
  const { data: existing } = await supabase
    .from("story_fires")
    .select("fire_count")
    .eq("story_id", storyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("story_fires")
      .update({ fire_count: Math.max(0, existing.fire_count - 1) })
      .eq("story_id", storyId);
    if (error) throw error;
  }
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
      } catch (e) {
        console.error(e);
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
        const { error: insertError } = await supabase
          .from("user_fires")
          .insert({ user_id: userId, story_id: storyId });
        if (insertError) throw insertError;

        await incrementFireCount(storyId, initialCount);
      } else {
        const { error: deleteError } = await supabase
          .from("user_fires")
          .delete()
          .eq("user_id", userId)
          .eq("story_id", storyId);
        if (deleteError) throw deleteError;

        await decrementFireCount(storyId);
      }
    } catch (e) {
      console.error(e);
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
